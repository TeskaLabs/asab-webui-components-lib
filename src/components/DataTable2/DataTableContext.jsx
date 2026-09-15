import React, { createContext, useContext, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'react-router';

import { updateLimit, updateStateLimit, adjustLimitForFilterPills } from './components/utils/updateTableLimit.jsx';
import { translateFromContent } from '../../utils/translateFromContent.js';
import { normalizeInitialParams } from './components/utils/aliasFiltersNormalization';

// Create an empty context
const CreateDataTableContext = createContext();

/*
	Generic merger of initialParams into a target collection.
	The `applyParam(key, value)` callback abstracts the write operation so the same
	traversal can target either a URLSearchParams instance or a plain state object.

	Returns `true` if at least one valid filter pill (`a{field}`) was written.
*/
const mergeInitialParamsGeneric = (initParams, applyParam) => {
	let hasFilterPills = false;

	// Advanced filters: must be an object, with an array of values for each field
	if (initParams?.a && (typeof initParams.a === 'object') && !Array.isArray(initParams.a)) {
		Object.entries(initParams.a).forEach(([key, value]) => {
			// Ignore filter fields with invalid values
			if (!Array.isArray(value)) {
				return;
			}

			// Remove null/undefined values and duplicates before writing the parameter
			const uniqueValues = [...new Set(value.filter((item) => item != null))];

			if (uniqueValues.length > 0) {
				applyParam(`a${key}`, uniqueValues);
				hasFilterPills = true;
			}
		});
	}

	// Sorting: must be an object with valid normalized sort directions
	if (initParams?.s && (typeof initParams.s === 'object') && !Array.isArray(initParams.s)) {
		Object.entries(initParams.s).forEach(([key, value]) => {
			// Ignore sort fields with invalid directions
			if (!['a', 'd'].includes(value)) {
				return;
			}

			applyParam(`s${key}`, value);
		});
	}

	// Full-text search: must be a string
	if (typeof initParams?.f === 'string') {
		applyParam('f', initParams.f);
	}

	return hasFilterPills;
};

/*
	Writes initialParams into a URLSearchParams instance.
	Arrays are serialized as comma-separated strings (the format used by the URL).
*/
const mergeInitialParams = (targetParams, initParams) =>
	mergeInitialParamsGeneric(initParams, (key, value) => {
		targetParams.set(key, Array.isArray(value) ? value.join(',') : value);
	});

/*
	Writes initialParams into a plain state object.
	Arrays are stored as-is because state consumers (serializeParams, getParam)
	handle arrays differently from URL params.
*/
const mergeInitialParamsIntoState = (targetState, initParams) =>
	mergeInitialParamsGeneric(initParams, (key, value) => {
		targetState[key] = value;
	});

// AppContextProvider component to wrap the application and provide the context
const DataTableContextProvider = ({ children, disableParams, initialLimit, initialParams }) => {
	// TODO: Unify initialLimit and initialParams. This is a weird design; initialLimit is obsoleted by the introduction of initialParams
	if (initialLimit && initialParams) {
		console.warn('DataTable2: initialLimit and initialParams cannot be used together. initialParams will be ignored.');
	}
	const defaultParams = { p: 1, i: initialLimit };
	const [searchParams, setSearchParams] = useSearchParams(defaultParams);
	const [stateParams, setStateParams] = useState(defaultParams);
	const filterFieldsRef = useRef({}); // Ref to store filter fields persistently without triggering re-renders
	const customPillRef = useRef({}); // Ref for store obj with custom pills with individual key access
	const normalizedInitialParams = useMemo(
		() => normalizeInitialParams(initialParams),
		[initialParams],
	);

	const initialParamsRef = useRef(normalizedInitialParams);
	initialParamsRef.current = normalizedInitialParams;

	/*
		Resets filters, sorting and search back to the latest `initialParams` defaults
		(URL or state mode) and forces page 1. Does not set `i` — the limit is
		recomputed later by `initializeTableParams` based on the resulting pills.
	*/
	const resetParams = () => {
		// URL mode
		if (!disableParams) {
			const newParams = new URLSearchParams();

			// Always return to the first page after a reset.
			newParams.set('p', '1');

			/*
				Re-apply the current defaults. May be empty/undefined — in that case
				nothing is added and the table ends up with no filters at all.
			*/
			mergeInitialParams(newParams, initialParamsRef.current);

			// Replace the whole URL state in one shot, without pushing a new entry.
			setSearchParams(newParams, { replace: true });
			return;
		}

		// State mode: same idea as above, but using a plain object as the target.
		const updatedState = {
			p: 1,
		};

		// Re-apply the current defaults into the state object.
		mergeInitialParamsIntoState(updatedState, initialParamsRef.current);

		/*
			Replace the entire state (not merged with the previous one) to guarantee
			a clean slate, matching the URL-mode behavior above.
		*/
		setStateParams(updatedState);
	};

	/*
		Initializes table parameters when the limit is not set.
		Calculates the limit based on the container height and adjusts it
		when filter pills are present.
		Applies initialParams only when no user-defined filters, sorting,
		search, or pagination are already set.
	*/
	const initializeTableParams = (baseLimit) => {
		// Get the current table limit from URL params or internal state
		const currentLimit = disableParams
			? parseInt(stateParams.i, 10) || 0
			: parseInt(searchParams.get('i') || '0', 10);

		// Do not reinitialize parameters if the table limit is already set
		if (currentLimit > 0) {
			return;
		}

		// Get the latest initial parameters from the ref
		const init = initialParamsRef.current;

		// Update URL search parameters when URL params are enabled
		if (!disableParams) {
			const newParams = new URLSearchParams(searchParams);

			// Get all currently defined URL parameter keys
			const keys = [...newParams.keys()];

			// Check whether the URL already contains user-defined table parameters
			const urlHasUserParams = keys.some((k) => k.startsWith('a') || k.startsWith('s') || k === 'f')
				|| parseInt(newParams.get('p') || '1', 10) > 1;

			// Check for existing filter pills or apply initial filters when no user parameters exist
			const hasPills = keys.some((k) => k.startsWith('a'))
				|| (!urlHasUserParams && init ? mergeInitialParams(newParams, init) : false);

			// Set the first page if the page parameter is not already defined.
			if (!newParams.get('p')) {
				newParams.set('p', '1');
			}

			// Set the calculated limit and reduce it when filter pills require an extra row
			newParams.set('i', String(adjustLimitForFilterPills(baseLimit, hasPills)));

			// Replace the current URL parameters without adding a new history entry
			setSearchParams(newParams, { replace: true });
			return;
		}

		const updatedState = { ...stateParams };
		const keys = Object.keys(updatedState);

		// Check whether the state already contains user-defined table parameters
		const stateHasUserParams = keys.some((k) => k.startsWith('a') || k.startsWith('s') || k === 'f')
			|| parseInt(updatedState.p || 1, 10) > 1;

		// Check for existing filter pills or apply initial filters when no user parameters exist
		const hasPills = keys.some((k) => k.startsWith('a'))
			|| (!stateHasUserParams && init ? mergeInitialParamsIntoState(updatedState, init) : false);

		// Set the first page if the page parameter is not already defined
		updatedState.p = updatedState.p ?? 1;

		// Set the calculated limit and reduce it when filter pills require an extra row
		updatedState.i = adjustLimitForFilterPills(baseLimit, hasPills);

		setStateParams(updatedState);
	};

	// Method to get param with option to set up splitting method used for searchParams
	const getParam = (param, options = {}) => {
		if (!disableParams) {
			if ((param === 'i') || (param === 'p')) {
				return _parseParam(searchParams.get(param));
			} else {
				const { splitBy = undefined } = options;
				const result = searchParams.get(param);
				return splitBy && result ? result.split(splitBy) : result;
			}
		} else {
			if ((param === 'i') || (param === 'p')) {
				return _parseParam(stateParams[param]);
			} else {
				return stateParams[param];
			}
		}
	};

	// Method to obtain all params available as a JS object
	const getAllParams = () => {
		if (!disableParams) {
			return Object.fromEntries(searchParams.entries());
		} else {
			return stateParams;
		}
	};

	/*
		Method to set params. Params are being set as object { key1: value1, key2: value2 }.
		Optional replace value will replace URL when using searchParams.
	*/
	const setParams = (params, replace = false) => {
		if (!disableParams) {
			setSearchParams((searchParams) => {
				return _updateSearchParams(searchParams, params);
			}, { replace: replace });
		} else {
			setStateParams((prevState) => ({ ...prevState, ...params }));
		}
	};

	// Method to remove param
	const removeParam = (param) => {
		if (!disableParams) {
			setSearchParams((prevSearchParams) => {
				const updatedParams = new URLSearchParams(prevSearchParams);
				updatedParams.delete(param);
				return updatedParams;
			});
		} else {
			// Use destructuring to remove the desired key-value pair
			setStateParams((prevState) => {
				const { [param]: _, ...rest } = prevState;
				return rest;
			});
		}
	};

	/*

		Particular DataTable2 methods out of adding, retrieving and removing scope

	*/

	// Method to update advanced single value filter
	const updateSingleValueFilter = (field, value) => {
		// Add/replace value
		if (!disableParams) {
			let updatedSearchParams = new URLSearchParams();
			searchParams.forEach((value, key) => {
				if (!key.startsWith(`a${field}`)) {
					updatedSearchParams.append(key, value);
				}
			})
			/*	Only decrease limit when adding the very first filtering.
				Check original params (including the field being replaced) so that
				replacing an existing filter does not decrease the limit a second time
			*/
			const isFirstFilter = ![...searchParams.entries()].some(([key]) => key.startsWith('a'));
			if (isFirstFilter) {
				updateLimit("decrease", updatedSearchParams);
			}
			updatedSearchParams.set("p", 1);
			updatedSearchParams.append(`a${field}`, value);
			setSearchParams(updatedSearchParams);
		} else {
			setStateParams(prevState => {
				// Add/replace value for non-advanced sorting
				let updatedState = {};
				Object.keys(prevState).forEach(key => {
					if (!key.startsWith(`a${field}`)) {
						updatedState[key] = prevState[key];
					}
				});
				// Same check against the original prevState (before stripping the field)
				const isFirstFilter = !Object.keys(prevState).some(key => key.startsWith('a'));
				if (isFirstFilter) {
					updateStateLimit("decrease", updatedState);
				}
				updatedState['p'] = 1;
				updatedState[`a${field}`] = [value];
				return updatedState;
			});
		}
	};

	// Method to update advanced multi value filter
	const updateMultiValueFilter = (field, value) => {
		let valuesToUpdate = getParam(`a${field}`, {splitBy: ','});
		if (valuesToUpdate) {
			if (valuesToUpdate.includes(value) == true) {
				valuesToUpdate = valuesToUpdate.filter(item => item != value);
			} else {
				valuesToUpdate.push(value);
			}
			if (valuesToUpdate && (valuesToUpdate.length > 0)) {
				if (!disableParams) {
					setSearchParams((searchParams) => {
						updateLimit("decrease", searchParams);
						searchParams.set("p", 1);
						searchParams.set(`a${field}`, valuesToUpdate);
						return searchParams;
					});
				} else {
					setStateParams(prevState => {
						const updatedState = { ...prevState };
						updateStateLimit("decrease", updatedState);
						updatedState['p'] = 1;
						updatedState[`a${field}`] = valuesToUpdate;
						return updatedState;
					});
				}
			} else {
				clearMultiValueFilter(field);
			}
		} else {
			if (!disableParams) {
				setSearchParams((searchParams) => {
					updateLimit("decrease", searchParams);
					searchParams.set("p", 1);
					searchParams.set(`a${field}`, value);
					return searchParams;
				});
			} else {
				setStateParams(prevState => {
					const updatedState = { ...prevState };
					updateStateLimit("decrease", updatedState);
					updatedState['p'] = 1;
					updatedState[`a${field}`] = [value];
					return updatedState;
				});
			}
		}
	};

	// Method for clearing values in advanced multi value filter
	const clearMultiValueFilter = (field) => {
		if (!disableParams) {
			setSearchParams((prevSearchParams) => {
				const updatedParams = new URLSearchParams(prevSearchParams);
				updatedParams.delete(`a${field}`);
				updateLimit("increase", updatedParams);
				updatedParams.set("p", 1);
				return updatedParams;
			});
		} else {
			// Use destructuring to remove the desired key-value pair
			setStateParams((prevState) => {
				const { [`a${field}`]: _, ...rest } = prevState;
				updateStateLimit("increase", rest);
				rest['p'] = 1;
				return rest;
			});

		}
	};

	// Method for applying sorting
	const onTriggerSort = (event, field, value) => {
		if (event.shiftKey) {
			// shift + left mouse click
			if (getParam(`s${field}`) != null) {
				// Remove field from (advanced) sorting
				removeParam(`s${field}`);
			} else {
				// Add field to advanced sorting
				setParams({[`s${field}`]: value});
			}
		} else if (getParam(`s${field}`) != null) {
			setParams({[`s${field}`]: value});
		} else {
			if (!disableParams) {
				// Add/replace value for non-advanced sorting
				let updatedSearchParams = new URLSearchParams();
				searchParams.forEach((value, key) => {
					if (!key.startsWith("s")) {
						updatedSearchParams.append(key, value);
					}
				})
				updatedSearchParams.append(`s${field}`, value);
				setSearchParams(updatedSearchParams);
			} else {
				setStateParams(prevState => {
					// Add/replace value for non-advanced sorting
					let updatedState = {};
					Object.keys(prevState).forEach(key => {
						if (!key.startsWith("s")) {
							updatedState[key] = prevState[key];
						}
					});
					updatedState[`s${field}`] = value;
					return updatedState;
				});
			}
		}
	};

	// Method for removal a single pill from DataTable2
	const removeSinglePill = (field) => {
		if (!disableParams) {
			setSearchParams((prevSearchParams) => {
				const updatedParams = new URLSearchParams(prevSearchParams);
				updatedParams.delete(field);
				updateLimit("increase", updatedParams);
				updatedParams.set("p", 1);
				return updatedParams;
			});
		} else {
			// Use destructuring to remove the desired key-value pair
			setStateParams((prevState) => {
				const { [field]: _, ...rest } = prevState;
				// Update the limit
				updateStateLimit("increase", rest);
				// Set 'p' to 1 (which is default)
				rest['p'] = 1;
				return rest;
			});
		}
	};

	// Method for removal a pill when there are more than 1 pills in the DataTable2
	const removeMultiPill = (field, value) => {
		let valuesToUpdate = getParam(field, {splitBy: ','});
		valuesToUpdate = valuesToUpdate.filter(item => item != value);
		if (valuesToUpdate && (valuesToUpdate.length > 0)) {
			setParams({ p: 1, [field]: valuesToUpdate})
		} else {
			removeSinglePill(field);
		}
	};

	// Method to serialize parameters for request query
	const serializeParams = () => {
		if (!disableParams) {
			// Convert searchParams to JS object
			const paramsObject = {};
			if (searchParams) {
				for (const [key, value] of searchParams.entries()) {
					paramsObject[key] = value;
				}
			}
			return paramsObject;
		} else {
			if (stateParams) {
				 // Create a new object with the same keys
				const updatedState = { ...stateParams };
				// Iterate over each key in the object
				Object.keys(updatedState).forEach(key => {
					// If the value is an array, join it to a comma-separated string
					if (Array.isArray(updatedState[key])) {
						updatedState[key] = updatedState[key].join(',');
					}
				});
				return updatedState;
			}
		}
	};

	// Method to get filter field label to be displayed in the DataTableBadge
	const getFilterFieldLabel = (key) => {
		return filterFieldsRef.current[key]?.fieldLabel ?? null;
	};

	// Method to normalize field items
	const setNormalizedFieldItems = (key, fieldItems) => {
		if (!fieldItems || fieldItems.length === 0) return;
		if (filterFieldsRef.current[key]?.items) return;

		const normalized = fieldItems.map(item => {
			if (typeof item === 'object' && item !== null) {
				const label = item.label
					? translateFromContent(item.label)
					: String(item.key ?? item.value); // Fallback to key or value if label is not available
				return {
					value: String(item.key ?? item.value),
					label
				};
			}
			return { value: String(item), label: String(item) }; // Fallback to value if item is not an object
		});

		filterFieldsRef.current[key] = { ...filterFieldsRef.current[key], items: normalized };
	};

	// Method to get normalized field items
	const getNormalizedFieldItems = (key) => {
		return filterFieldsRef.current[key]?.items ?? null;
	};

	// Method to set filter field label
	const setFilterFieldLabel = (obj) => {
		const entries = obj != null && typeof obj === 'object' ? Object.entries(obj) : [];
		const fieldEntry = entries[0]; // Extracts the first key-value pair from the field object
		if (!fieldEntry) {
			console.warn('DataTableContext: "obj" prop is missing or empty - cannot set filter field label.');
			return;
		}

		const [fieldKey, fieldLabel] = fieldEntry; // Extract the key and label from the field entry
		if (filterFieldsRef.current[fieldKey]?.fieldLabel) return;
		filterFieldsRef.current[fieldKey] = { ...filterFieldsRef.current[fieldKey], fieldLabel };
	};

	//  Retrieves a custom pill component by key
	const getCustomPill = (key) => {
		// Return stored pill component or null if doesn't exist
		return customPillRef.current?.[key] || null;
	}

	// Stores or updates a custom pill component in the reference
	const setCustomPill = (pill, field) => {
		// Initialize ref object if empty
		if (!customPillRef.current) {
			customPillRef.current = {};
		}

		// Store/update the pill component for the specified field
		customPillRef.current[field] = pill;
	}

	// Inner method to update search params
	const _updateSearchParams = (searchParams, params) => {
		Object.entries(params).forEach(([key, value]) => {
			searchParams.set(key, value);
		});
		return searchParams;
	};

	// Method to parse the given parameter into an integer with the specified base. The default base is 10
	const _parseParam = (param, base = 10) => {
		return parseInt(param, base);
	};

	// Memoize the context value to avoid unnecessary re-renders
	const paramsContext = useMemo(() => ({
		getParam,
		getAllParams,
		setParams,
		removeParam,
		updateSingleValueFilter,
		updateMultiValueFilter,
		clearMultiValueFilter,
		removeSinglePill,
		removeMultiPill,
		onTriggerSort,
		serializeParams,
		getFilterFieldLabel,
		setNormalizedFieldItems,
		getNormalizedFieldItems,
		setFilterFieldLabel,
		setCustomPill,
		getCustomPill,
		initializeTableParams,
		resetParams,
		watchParams: { searchParams, stateParams } // Context value for watching params
	}), [searchParams, stateParams]);

	return (
		<CreateDataTableContext.Provider value={paramsContext}>
			{children}
		</CreateDataTableContext.Provider>
	);
};

const useDataTableContext = () => useContext(CreateDataTableContext);

export { DataTableContextProvider, useDataTableContext };
