import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
	Dropdown, DropdownToggle, DropdownItem, DropdownMenu,
	Input
} from 'reactstrap';

import { useDataTableContext } from '../../DataTableContext.jsx';
import './DataTableAdvFilter2.scss';

export function DataTableAdvFilterMultiValue2({ field, fieldItems }) {
	const { getParam, updateMultiValueFilter, clearMultiValueFilter, setFilterFieldLabel, setNormalizedFieldItems, getNormalizedFieldItems } = useDataTableContext();
	const { t } = useTranslation();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const entries = field != null && typeof field === 'object' ? Object.entries(field) : [];
	const primaryFieldEntry = entries[0]; // Extracts the first key-value pair from the field object
	const [primaryFieldKey, primaryFieldValue] = primaryFieldEntry ?? []; 
	const valuesToUpdate = getParam(`a${primaryFieldKey}`, { splitBy: ','});
	const normalizedFieldItems = getNormalizedFieldItems(primaryFieldKey);

	// Update filterFields and normalizedFieldItems in DataTable context
	useEffect(() => {
		setFilterFieldLabel(field);
		setNormalizedFieldItems(primaryFieldKey, fieldItems); // Store normalized items in context for DataTableBadge label lookup
	},[]);

	if (!primaryFieldEntry) {
		console.warn('DataTableAdvFilterMultiValue2:  "field" prop is missing or empty - cannot render filter.');
		return null;
	}

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
			<DropdownMenu className='adv-filter-dropdown-menu overflow-y-auto'>
				<DropdownItem
					onClick={() => clearMultiValueFilter(primaryFieldKey)} // Use key of field object to clear filter
				>
					{t('General|Clear')}
				</DropdownItem>
				<DropdownItem divider />
				{normalizedFieldItems?.map((item, idx) => {
					const itemValue = item.value;
					return (
						<DropdownItem
							key={idx}
							onClick={() => updateMultiValueFilter(primaryFieldKey, itemValue)} // Use key of field object to update the filter
						>
							<Input
								className="me-2"
								type="checkbox"
								checked={valuesToUpdate && valuesToUpdate?.includes(itemValue) ? true : false}
								readOnly
								name={`${idx}${itemValue}`}
							/>
							{item.label}
						</DropdownItem>
					);
				})}
			</DropdownMenu>
		</Dropdown>
	)
}
