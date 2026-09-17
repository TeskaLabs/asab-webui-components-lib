/*
	Top-level key aliases for user-friendly initialParams input.
	Any of these keys can appear in the object passed via the `initialParams` prop.
	The value is the internal base key used by the data-table (and by the URL).
*/
const TOP_LEVEL_KEY_ALIASES = {
	filters: 'a', // advanced filters -> keys `a{field}` in URL/state
	sort: 's',    // sorting          -> keys `s{field}` in URL/state
	search: 'f',  // full-text search -> key `f` in URL/state
};

/*
	Sort direction aliases. Only the `s`/`sort` object values are mapped through this.
	Anything not listed here (e.g. field names like `type`, `_c`) is passed through untouched.
*/
const SORT_DIRECTION_ALIASES = {
	asc: 'a',
	desc: 'd',
	a: 'a',
	d: 'd',
};

/*
	Normalizes initialParams into the internal data-table format.

	Supported input:
		{
			filters: { status: ['open', 'triaged'] },
			sort: { type: 'desc' },
			search: 'Ticket-01'
		}

	Base keys (a, s, f) are also supported.

	Rules:
		- filters / a must be an object, and each filter value must be an array.
		- sort / s must be an object, and each direction must be 'asc', 'desc', 'a', or 'd'.
		- 'asc' and 'desc' are converted to 'a' and 'd'.
		- search / f must be a string.
		- Invalid values are ignored.
		- Unknown top-level keys are ignored.
		- User-friendly aliases take precedence over base keys.
*/
export const normalizeInitialParams = (params) => {
	// Return an empty object for invalid top-level input
	if (!params || (typeof params !== 'object') || Array.isArray(params)) {
		return {};
	}

	// Copy all parameters so unknown keys are preserved unchanged.
	const normalized = { ...params };

	// Normalize top-level aliases and remove their original names
	Object.entries(TOP_LEVEL_KEY_ALIASES).forEach(([alias, baseKey]) => {
		if (params[alias] !== undefined) {
			normalized[baseKey] = params[alias];
			delete normalized[alias];
		}
	});

	// Normalize filters only when they are provided as an object
	if (normalized.a && (typeof normalized.a === 'object') && !Array.isArray(normalized.a)) {
		normalized.a = Object.fromEntries(
			Object.entries(normalized.a)
				.filter(([, value]) => Array.isArray(value)),
		);
	}

	// Normalize sort only when it is provided as an object
	if (normalized.s && (typeof normalized.s === 'object') && !Array.isArray(normalized.s)) {
		normalized.s = Object.fromEntries(
			Object.entries(normalized.s)
				.filter(([, direction]) => SORT_DIRECTION_ALIASES[direction] !== undefined)
				.map(([field, direction]) => [
					field,
					SORT_DIRECTION_ALIASES[direction],
				]),
		);
	}

	// Keep search only when it is a string
	if (normalized.f != undefined && (typeof normalized.f !== 'string')) {
		delete normalized.f;
	}

	return normalized;
};
