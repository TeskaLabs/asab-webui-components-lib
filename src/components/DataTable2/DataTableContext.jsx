import React, { createContext, useContext, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { updateLimit, updateStateLimit } from './components/utils/updateTableLimit.jsx';

// Create an empty context
const CreateDataTableContext = createContext();

// AppContextProvider component to wrap the application and provide the context
const DataTableContextProvider = ({ children, disableParams, initialLimit }) => {
	const defaultParams = { p: 1, i: initialLimit };
	const [searchParams, setSearchParams] = useSearchParams(defaultParams);
	const [stateParams, setStateParams] = useState(defaultParams);
	const filterFieldsRef = useRef({}); // Ref to store filter fields persistently without triggering re-renders.

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
// Method to update advanced single value filter
	const updateRangeValueFilter = (field, value) => {
		console.log('updateRangeValueFilter', field	);
		// Если field - объект (новый формат)
		if (typeof field === 'object' && field !== null) {
			const { sc, ec, timestamp, startDate, endDate } = field;
			const timestampSuffix = timestamp ? `_${timestamp}` : '';

			if (!disableParams) {
				let updatedSearchParams = new URLSearchParams();
				// Сохраняем все существующие параметры, кроме тех, которые начинаются с rsc__ или rec__
				searchParams.forEach((value, key) => {
					if (!key.startsWith('rsc') && !key.startsWith('rec')) {
						updatedSearchParams.append(key, value);
					}
				});

				updateLimit("decrease", updatedSearchParams);
				updatedSearchParams.set("p", 1);

				// Добавляем новые параметры диапазона
				if (startDate !== undefined) {
					updatedSearchParams.set(`rsc${timestampSuffix}`, startDate);
				}
				if (endDate !== undefined) {
					updatedSearchParams.set(`rec${timestampSuffix}`, endDate);
				}

				setSearchParams(updatedSearchParams);
			} else {
				setStateParams(prevState => {
					let updatedState = {};
					// Сохраняем все существующие параметры, кроме тех, которые начинаются с rsc__ или rec__
					Object.keys(prevState).forEach(key => {
						if (!key.startsWith('rsc') && !key.startsWith('rec')) {
							updatedState[key] = prevState[key];
						}
					});

					updateStateLimit("decrease", updatedState);
					updatedState['p'] = 1;

					// Добавляем новые параметры диапазона
					if (startDate !== undefined) {
						updatedState[`rsc${timestampSuffix}`] = startDate;
					}
					if (endDate !== undefined) {
						updatedState[`rec${timestampSuffix}`] = endDate;
					}

					return updatedState;
				});
			}
		}
	};

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
			updateLimit("decrease", updatedSearchParams);
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
				updateStateLimit("decrease", updatedState);
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

	// Method to get the current filter fields based on a given key
	const getFilterField = (key) => {
		console.log(filterFieldsRef.current, key)
		return filterFieldsRef.current[key];
	};

	// Method to set filter fields in filterFieldsRef
	const setFilterField = (obj) => {
		const fields = Object.entries(obj)[0];
		// Check and only add field if it doesnt exist
		if (!filterFieldsRef.current[fields[0]]) {
			filterFieldsRef.current[fields[0]] = fields[1];
		}
	};

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
		updateRangeValueFilter,
		updateSingleValueFilter,
		updateMultiValueFilter,
		clearMultiValueFilter,
		removeSinglePill,
		removeMultiPill,
		onTriggerSort,
		serializeParams,
		getFilterField,
		setFilterField,
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
