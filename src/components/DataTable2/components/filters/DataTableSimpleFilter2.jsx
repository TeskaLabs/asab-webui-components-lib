import React from 'react';
import { useTranslation } from 'react-i18next';

import {
	Input, InputGroup, InputGroupText
} from 'reactstrap';

import { useDataTableContext } from '../../DataTableContext.jsx';

export function DataTableFilter2() {
	const { getParam, setParams } = useDataTableContext();
	const { t } = useTranslation();

	const onFilterChange = (e) => {
		e.preventDefault();
		setParams({p: 1, f: `${e.target.value}`});
	}

	return (
		<div>
			<InputGroup>
				<InputGroupText><i className="bi bi-search"></i></InputGroupText>
				<Input
					autoFocus
					value={getParam("f") ? getParam("f") : ""}
					onChange={(e) => {onFilterChange(e)}}
					placeholder={t('General|Search')}
					type="text"
					bsSize="sm"
					name="table-simple-filter"
				/>
			</InputGroup>
		</div>
	)
}
