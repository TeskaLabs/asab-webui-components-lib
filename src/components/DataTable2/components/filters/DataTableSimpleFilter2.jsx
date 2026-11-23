import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
	Input, InputGroup, InputGroupText
} from 'reactstrap';

import { useDataTableContext } from '../../DataTableContext.jsx';

export function DataTableFilter2() {
	const { getParam, setParams, watchParams } = useDataTableContext();
	const { t } = useTranslation();
	const [filterText, setFilterText] = useState(() => getParam('f') ?? '');

	// Keep local state in sync when URL params change externally (e.g. browser navigation)
	useEffect(() => {
		setFilterText(getParam('f') ?? '');
	}, [watchParams]);

	const onFilterChange = (e) => {
		const value = e.target.value;
		setFilterText(value);
		setParams({ p: 1, f: value });
	};

	return (
		<div>
			<InputGroup>
				<InputGroupText><i className="bi bi-search"></i></InputGroupText>
				<Input
					autoFocus
					value={filterText}
					onChange={onFilterChange}
					placeholder={t('General|Search')}
					type="text"
					bsSize="sm"
					name="table-simple-filter"
				/>
			</InputGroup>
		</div>
	)
}
