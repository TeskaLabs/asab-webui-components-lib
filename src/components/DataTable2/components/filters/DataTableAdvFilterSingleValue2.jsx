import React, { useState, useEffect } from 'react';

import {
	Dropdown, DropdownToggle, DropdownItem, DropdownMenu
} from 'reactstrap';

import { useDataTableContext } from '../../DataTableContext.jsx';
import './DataTableAdvFilter2.scss';

export function DataTableAdvFilterSingleValue2({ field, fieldItems }) {
	const { updateSingleValueFilter, setFilterField, getNormalizedFieldItems } = useDataTableContext();
	const [ dropdownOpen, setDropdownOpen ] = useState(false);
	const primaryFieldEntry = Object.entries(field)[0]; // Extracts the first key-value pair from the field object
	const normalizedFieldItems = getNormalizedFieldItems(primaryFieldEntry[0], fieldItems); // Normalized items - for backwards compatibilty (after translation of fieldItems introduced)

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
				{normalizedFieldItems?.map((item, idx) => (
					<DropdownItem
						key={idx}
						onClick={() => updateSingleValueFilter(primaryFieldEntry[0], item.value)} // Use key of field object to update the filter
					>
						{item.label}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	)
}
