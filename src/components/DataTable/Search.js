import React from 'react';

import {
	InputGroup, InputGroupText, Input
} from 'reactstrap';

const Search = ({ search, filterValue, setFilterValue }) => {

	return (
		<div className="float-end ms-3 data-table-search">
				<InputGroup>
					{search.icon &&
						<InputGroupText><i className={search.icon}></i></InputGroupText>
					}
					<Input
						value={filterValue}
						onChange={e => setFilterValue(e.target.value)}
						placeholder={search.placeholder}
						type="text"
						bsSize="sm"
						name="search"
					/>
				</InputGroup>
		</div>
	);
}

export default Search;
