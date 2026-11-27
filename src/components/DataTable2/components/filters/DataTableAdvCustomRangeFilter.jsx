import React, { useEffect } from 'react';
import { useDataTableContext } from '../../DataTableContext.jsx';

export function DataTableAdvCustomRangeFilter({ modes, content, customPill }) {
	const { setCustomPill } = useDataTableContext();

	useEffect(() => {
		modes.forEach((mode) => {
			const rangeKey = `r${mode}`;

			['tsc', 'tec'].forEach((boundary) => {
				const paramKey = `${rangeKey}.${boundary}`;

				setCustomPill(
					React.cloneElement(customPill, { rangeKey, paramKey }),
					paramKey
				);
			});
		});
	}, [modes, customPill, setCustomPill]);

	return content();
}
