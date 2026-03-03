import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
	Dropdown, DropdownToggle, DropdownItem, DropdownMenu,
	Input
} from 'reactstrap';

import { useDataTableContext } from '../../DataTableContext.jsx';
import './DataTableAdvFilter2.scss';

export function DataTableAdvFilterMultiValue2({ field, fieldItems }) {
	const { getParam, updateMultiValueFilter, clearMultiValueFilter, setFilterField, setNormalizedFieldItems, getNormalizedFieldItems } = useDataTableContext();
	const { t } = useTranslation();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const primaryFieldEntry = Object.entries(field)[0]; // Extracts the first key-value pair from the field object
	const primaryFieldKey = primaryFieldEntry[0];
	const primaryFieldValue = primaryFieldEntry[1];
	const valuesToUpdate = getParam(`a${primaryFieldKey}`, { splitBy: ','});
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
