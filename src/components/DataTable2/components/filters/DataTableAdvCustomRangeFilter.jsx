import React, { useEffect } from 'react';
import { useDataTableContext } from '../../DataTableContext.jsx';

export function DataTableAdvCustomRangeFilter({ modes, content, customPill }) {
	const { setCustomPill } = useDataTableContext();

	useEffect(() => {
		modes.forEach((mode) => {
			const rangeKey = `r${mode}`;

			setCustomPill(
				React.cloneElement(customPill, { rangeKey }),
				rangeKey
			);
		});
	}, [modes, customPill, setCustomPill]);

	return content();
}

// import React, { useEffect } from 'react';
//
// import { useDataTableContext } from '../../DataTableContext.jsx';
//
// // Registers a custom pill for every field/mode combination.
// export function DataTableAdvCustomRangeFilter({ fields, modes, content, customPill }) {
// 	const { setCustomPill } = useDataTableContext();
//
// 	useEffect(() => {
// 		fields.forEach((field) => {
// 			modes.forEach((mode) => {
// 				const rangeKey = `${field}${mode}`;
//
// 				setCustomPill(
// 					React.cloneElement(customPill, { rangeKey }),
// 					rangeKey,
// 				);
// 			});
// 		});
// 	}, [fields, modes, customPill, setCustomPill]);
//
// 	return content();
// }
//

// import React, { useCallback, useEffect } from 'react';
// import { useDataTableContext } from '../../DataTableContext.jsx';
//
// export function DataTableAdvCustomRangeFilter({
// 												  fields,
// 												  modes,
// 												  content: Content,
// 												  customPill,
// 											  }) {
// 	const {
// 		setCustomPill,
// 		updateFilterParams,
// 	} = useDataTableContext();
//
// 	useEffect(() => {
// 		fields.forEach((field) => {
// 			modes.forEach((mode) => {
// 				const rangeKey = `${field}${mode}`;
//
// 				setCustomPill(
// 					React.cloneElement(customPill, { rangeKey }),
// 					rangeKey,
// 				);
// 			});
// 		});
// 	}, [fields, modes, customPill, setCustomPill]);
//
// 	const handleApply = useCallback(({ mode, start, end }) => {
// 		const params = {};
//
// 		fields.forEach((field) => {
// 			const key = `${field}${mode}`;
// 			const value = field.startsWith('rsc_') ? start : end;
//
// 			if (value != null) {
// 				params[key] = value;
// 			}
// 		});
//
// 		updateFilterParams({
// 			set: params,
// 			remove: fields
// 				.map((field) => `${field}${mode}`)
// 				.filter((key) => !(key in params)),
// 			resetPage: true,
// 		});
// 	}, [fields, updateFilterParams]);
//
// 	return <Content onApply={handleApply} />;
// }




