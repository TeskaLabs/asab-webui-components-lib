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
	const valuesToUpdate = getParam(`a${primaryFieldEntry[0]}`, { splitBy: ','});
	const normalizedFieldItems = getNormalizedFieldItems(primaryFieldEntry[0]);

	useEffect(() => {
		setFilterField(field);
		setNormalizedFieldItems(primaryFieldEntry[0], fieldItems);
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
			<DropdownMenu className='adv-filter-dropdown-menu overflow-y-auto'>
				<DropdownItem
					onClick={() => clearMultiValueFilter(primaryFieldEntry[0])} // Use key of field object to clear filter
				>
					{t('General|Clear')}
				</DropdownItem>
				<DropdownItem divider />
				{normalizedFieldItems?.map((item, idx) => {
					const itemValue = item.value;
					return (
						<DropdownItem
							key={idx}
							onClick={() => updateMultiValueFilter(primaryFieldEntry[0], itemValue)} // Use key of field object to update the filter
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
