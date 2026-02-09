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

	// Normalize item to the primitive value sent to the API (supports both string and { value, label/translationKey } shapes)
	const getFilterValue = (item) => (
		typeof item === 'object' && item !== null && 'value' in item ? item.value : item
	);

	// Display label: translationKey (i18n), or pre-translated label, or raw value
	const getFilterLabel = (item) => {
		if (typeof item === 'object' && item !== null) {
			if (item.translationKey) return t(item.translationKey);
			if (item.label != null) return item.label;
		}
		return item;
	};

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
						onClick={() => updateSingleValueFilter(primaryFieldEntry[0], getFilterValue(item))}
					>
						{getFilterLabel(item)}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	)
}
