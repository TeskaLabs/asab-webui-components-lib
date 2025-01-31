import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
	Dropdown, DropdownToggle, DropdownItem, DropdownMenu
} from 'reactstrap';

import { useDataTableContext } from '../../DataTableContext.jsx';
import './DataTableAdvFilter2.scss';

export function DataTableAdvFilterSingleValue2({ field, fieldItems }) {
	const { updateSingleValueFilter, setFilterField } = useDataTableContext();
	const { t } = useTranslation();
	const [ dropdownOpen, setDropdownOpen ] = useState(false);
	const primaryFieldEntry = Object.entries(field)[0]; // Extracts the first key-value pair from the field object

	// Update filterFields in DataTable context
	useEffect(() => {
		setFilterField(field);
	},[]);

	const toggle = () => setDropdownOpen((prevState) => !prevState);

	return (
		<Dropdown className="adv-filter-dropdown" isOpen={dropdownOpen} toggle={toggle}>
			<DropdownToggle
				color="primary"
				outline
				className="adv-filter-dropdown-toggle"
				title={primaryFieldEntry[1]} // Use value of field object as title
				caret
			>
				<span className="adv-filter-title">
					{primaryFieldEntry[1]} {/* Use value of field object as title */}
				</span>
			</DropdownToggle>
			<DropdownMenu>
				{fieldItems.map((item, idx) => (
					<DropdownItem
						key={idx}
						onClick={() => updateSingleValueFilter(primaryFieldEntry[0], item)} // Use key of field object to update the filter
					>
						{item}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	)
}
