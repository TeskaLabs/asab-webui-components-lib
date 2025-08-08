import React, { useEffect } from 'react';

import { useDataTableContext } from '../../DataTableContext.jsx';

// Custom component for filtering in the table
export function DataTableAdvCustomFilter({ field, content, customPill }) {
	const { updateSingleValueFilter, setFilterField, setCustomPill } = useDataTableContext();

	// Update filterFields in DataTable context
	useEffect(() => {
		setFilterField(field);
		setCustomPill(customPill, field)
	},[]);

	// Transferring a function to the custom content for correct filter assignment
	return content(updateSingleValueFilter);

}
