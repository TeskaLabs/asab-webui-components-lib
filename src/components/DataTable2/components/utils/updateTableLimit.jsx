export const HEADER_FOOTER_OVERHEAD = 200;

export const computeBaseRowLimit = (containerHeight, rowHeight) =>
	Math.max(Math.floor((containerHeight - HEADER_FOOTER_OVERHEAD) / rowHeight), 5);

// Same ±1 rule as updateLimit for the filter-pill row
export const adjustLimitForFilterPills = (baseLimit, hasFilterPills) =>
	hasFilterPills && baseLimit > 1 ? baseLimit - 1 : baseLimit;

export const updateLimit = (action, searchParams) => {
	if (searchParams && ![...searchParams.entries()].some(([key]) => key.startsWith('a'))) {
		const currentLimit = parseInt(searchParams.get("i"), 10);
		if ((action == "decrease") && (currentLimit > 1)) {
			searchParams.set("i", currentLimit - 1);
		} else if (action == "increase") {
			searchParams.set("i", currentLimit + 1);
		}
	}
}

// Update limit of a stateParams
export const updateStateLimit = (action, params) => {
	if (params && !Object.keys(params).some(key => key.startsWith('a'))) {
		const currentLimit = parseInt(params.i, 10);
		if ((action == "decrease") && (currentLimit > 1)) {
			params.i = currentLimit - 1;
		} else if (action == "increase") {
			params.i = currentLimit + 1;
		}
	}
}
