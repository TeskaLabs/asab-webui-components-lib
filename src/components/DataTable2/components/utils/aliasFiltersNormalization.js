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
};

/*
	Normalizes user-friendly initialParams into the internal base shape.

	Accepts either the user-friendly form:
		{ filters: {...}, sort: { type: 'desc', _c: 'asc' }, search: 'hello' }
	or the already-base form:
		{ a: {...}, s: { type: 'd', _c: 'a' }, f: 'hello' }

	Rules:
		- Top-level keys are remapped via TOP_LEVEL_KEY_ALIASES (filters -> a, sort -> s, search -> f).
		- Base keys (`a`, `s`, `f`) are kept as-is, so mixing is allowed.
		- Only values inside the sort object are remapped via SORT_DIRECTION_ALIASES (asc -> a, desc -> d).
		- Field names inside filters/sort are never touched — they are application-specific.
		- `null` / non-object input is returned unchanged.
*/
export const normalizeInitialParams = (params) => {
	if (!params || typeof params !== 'object') return params;

	// Collect values from both alias and base keys first.
	// Alias takes precedence over base if both are present (e.g. `filters` wins over `a`).
	const resolved = {};
	Object.entries(params).forEach(([key, value]) => {
		// Map user-friendly key -> base key, keep base keys as-is.
		const baseKey = TOP_LEVEL_KEY_ALIASES[key] ?? key;
		resolved[baseKey] = value;
	});

	const normalized = {};

	// Filters (base key `a`).
	if (resolved.a) {
		normalized.a = resolved.a;
	}

	// Sort (base key `s`): remap direction values, keep field names intact.
	if (resolved.s) {
		normalized.s = Object.fromEntries(
			Object.entries(resolved.s).map(([field, direction]) => [
				field,
				SORT_DIRECTION_ALIASES[direction] ?? direction,
			]),
		);
	}

	// Search (base key `f`).
	if (resolved.f !== undefined) {
		normalized.f = resolved.f;
	}

	return normalized;
};