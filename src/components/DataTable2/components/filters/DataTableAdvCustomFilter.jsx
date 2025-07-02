import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
	Dropdown, DropdownToggle, DropdownItem, DropdownMenu
} from 'reactstrap';

import { useDataTableContext } from '../../DataTableContext.jsx';
import './DataTableAdvFilter2.scss';

export function DataTableAdvCustomFilter({ field, content }) {
	const { updateSingleValueFilter, setFilterField } = useDataTableContext();

	// Update filterFields in DataTable context
	useEffect(() => {
		setFilterField(field);
	},[]);

	return (
		content(updateSingleValueFilter)
	)
}
