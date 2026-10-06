import React, { useEffect } from 'react';

import { useDataTableContext } from '../../DataTableContext.jsx';

// Registers a custom pill for every field/mode combination.
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
				const rangeKey = `${field}${mode}`;

				setCustomPill(
					React.cloneElement(customPill, { rangeKey }),
					rangeKey,
				);
			});
		});
	}, [fields, modes, customPill, setCustomPill]);

	return content();
}