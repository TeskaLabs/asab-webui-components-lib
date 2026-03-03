import React, { useState, useEffect } from 'react';

import {
	Dropdown, DropdownToggle, DropdownItem, DropdownMenu
} from 'reactstrap';

import { useDataTableContext } from '../../DataTableContext.jsx';
import './DataTableAdvFilter2.scss';

export function DataTableAdvFilterSingleValue2({ field, fieldItems }) {
	const { updateSingleValueFilter, setFilterField, setNormalizedFieldItems, getNormalizedFieldItems } = useDataTableContext();
	const [ dropdownOpen, setDropdownOpen ] = useState(false);
	const primaryFieldEntry = Object.entries(field)[0]; // Extracts the first key-value pair from the field object
	const primaryFieldKey = primaryFieldEntry[0];
	const primaryFieldValue = primaryFieldEntry[1];
	const normalizedFieldItems = getNormalizedFieldItems(primaryFieldKey);

	// Update filterFields and normalizedFieldItems in DataTable context
	useEffect(() => {
		setFilterField(field);
		setNormalizedFieldItems(primaryFieldKey, fieldItems); // Store normalized items in context for DataTableBadge label lookup
	},[]);


	const toggle = () => setDropdownOpen((prevState) => !prevState);

	return (
		<Dropdown className="adv-filter-dropdown" isOpen={dropdownOpen} toggle={toggle}>
			<DropdownToggle
				color="primary"
				outline
				className="adv-filter-dropdown-toggle"
				title={primaryFieldValue} // Use value of field object as title
				caret
			>
				<span className="adv-filter-title">
					{primaryFieldValue} {/* Use value of field object as title */}
				</span>
			</DropdownToggle>
			<DropdownMenu>
				{normalizedFieldItems?.map((item, idx) => (
					<DropdownItem
						key={idx}
						onClick={() => updateSingleValueFilter(primaryFieldKey, item.value)} // Use key of field object to update the filter
					>
						{item.label}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	)
}
