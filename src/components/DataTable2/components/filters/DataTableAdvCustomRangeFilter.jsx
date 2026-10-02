import React, { useEffect } from 'react';

import { useDataTableContext } from '../../DataTableContext.jsx';

// Custom filter for URL parameters that share the same logical range.
export function DataTableAdvCustomRangeFilter({
												  fields,
												  modes,
												  content,
												  customPill,
											  }) {
	const { setCustomPill } = useDataTableContext();

	useEffect(() => {
		fields.forEach((field) => {
			modes.forEach((mode) => {
				setCustomPill(customPill, `${field}${mode}`);
			});
		});
	}, [fields, modes, customPill]);

	return content();
}