import React, { useEffect } from 'react';

import { useDataTableContext } from '../../DataTableContext.jsx';

// Custom component for filtering in the table
export function DataTableAdvCustomFilter({ field, content, customPill }) {
	const { updateSingleValueFilter, setFilterField, setCustomPill } = useDataTableContext();

	// Updates filter field and custom pill when dependencies change
	useEffect(() => {
		// Register the filter field in data table context
		setFilterField(field);
		// Get the first key from field object
		const fieldKey = Object.keys(field)[0];
		// Store the custom pill component associated with this field
		setCustomPill(customPill, fieldKey);
	},[customPill]);

	// Transferring a function to the custom content for correct filter assignment
	return content(updateSingleValueFilter);
}
