import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';

import { AsabReactJson } from "../AsabReactJson/AsabReactJson.jsx";
import { Table } from 'reactstrap';

import { DateTime } from '../DateTime/absolute/DateTime.jsx';

import { ActionButton } from './Buttons';

import './DataTable.scss';

const TableCell = ({
	obj, header, idx,
	isSublist
}) => {
	if (!obj) return <td className="ps-3" style={{ whiteSpace: "nowrap" }}>-</td>

	let cell, icon, customCellStyle;
	let textLinkStyle = {
		whiteSpace: "nowrap",
		marginBottom: 0
	}

	if (header?.customCellStyle) {
		customCellStyle = header.customCellStyle;
		textLinkStyle = {...textLinkStyle, ...customCellStyle}
	}

	if (header?.icon) {
		icon =  typeof header.icon === 'string'
			? (<i className={`${header.icon} pe-1`}></i>)
			: (header.icon);
	} else {
		icon = null;
	}

	if (header.json) cell = (
		<AsabReactJson
			className="data-table-reactjson"
			src={obj[header.key]}
			collapse={false}
			rootName=""
			enableClipboard={false}
		/>
	);

	else if (header.link) {
		let pathname = "#";
		if (typeof header.link === "object") {
			pathname = header.link.pathname + obj[header.link.key];
		} else if (typeof header.link === "function") {
			pathname = header.link(obj, header);
		}
		cell = obj[header.key] ? (
			<Link
				to={pathname}
				className="data-table-link"
				style={textLinkStyle}
				title={obj[header.key]}
			>
				{icon} {obj[header.key]}
			</Link>
		) : "-";
	}

	else if (header.datetime) cell = obj[header.key] ? (
		<DateTime
			className="data-table-datetime"
			value={obj[header.key]}
			dateTimeFormat={header?.datetime?.dateTimeFormat ? header?.datetime?.dateTimeFormat : "medium"}
		/>
	) : "-";

	else if (header.actionButton) {
		cell = (
			<ActionButton
				row={obj}
				header={header}
				actionButton={header.actionButton}
			/>
		);
	}

	else if (header.customComponent) {
		cell = header.customComponent.generate(obj, header);
	}

	else cell = obj[header.key] ? (
		<p style={textLinkStyle} title={obj[header.key]}>{obj[header.key]}</p>
	) : "-";

	if (icon && !(header.link || header.datetime || header.actionButton)) {
		cell = <>{icon} {cell}</>;
	}

	return idx === 0 && !isSublist ? (
			<th className="data-table-th" scope="row" style={{...customCellStyle}}>
				{cell}
			</th>
		) : (
			<td className="ps-3 data-table-td" style={{ whiteSpace: "nowrap", ...customCellStyle }}>
				{cell}
			</td>
		);
};

const Headers = ({ headers, sublists }) => (
	<>
		<colgroup className="data-table-colgroup">
			{sublists && <col style={{ width: "1px" }} />}
			{headers.map((_, idx) =>
				<col
					className={`data-table-col${idx}`}
					style={{ width: (idx === headers.length - 1) ? "auto" : "8em", ..._.customHeaderStyle }}
					key={idx}
				/>
			)}
		</colgroup>

		{/* <thead className={`thead-${theme === "theme-dark" || !theme ? "light" : "dark"} data-table-thead`}> */}
		<thead className="data-table-thead">
			<tr className="data-table-tr">
				{sublists && <th className="ps-3 data-table-sub-header-th">{" "}</th>}
				{headers.map((header, idx) => <th key={idx} className={`data-table-header-th${idx !== 0 ? " ps-3" : ""}`}>{header.name}</th>)}
			</tr>
		</thead>
	</>
);

const TableRow = ({
	obj, headers,
	rowStyle, rowClassName, category,
	collapseChildren, toggleChildrenOnRowClick
}) => {
	const [isSubUnwrapped, setSubUnwrapped] = useState((collapseChildren == false) ? true : false);

	const getStyle = (obj) => {
		if (rowStyle?.condition && rowStyle?.condition(obj)) {
			return rowStyle.style;
		}
		return {};
	}

	const getClassName = (obj) => {
		if (rowClassName?.condition && rowClassName?.condition(obj)) {
			return rowClassName.className;
		}
		return "";
	}

	const style = useMemo(() => getStyle(obj), [obj]);
	const className = useMemo(() => getClassName(obj), [obj]);

	return (
		<>
			<tr
				// Enable data-table-tr-cursor class only when category is present and toggleChildrenOnRowClick is set to true
				className={`data-table-tr ${className} ${category && (toggleChildrenOnRowClick == true) && "data-table-tr-cursor"}`}
				style={style}
				// Enable onClick only when category is present and toggleChildrenOnRowClick is set to true
				onClick={() => category && (toggleChildrenOnRowClick == true) && setSubUnwrapped(prev => !prev)}
			>
				{category && (
					<td className="data-table-arrow-btn" onClick={() => (toggleChildrenOnRowClick == true) ? null : setSubUnwrapped(prev => !prev)}>
						<i className={isSubUnwrapped ? "bi bi-arrow-down-circle" : "bi bi-arrow-right-circle"}></i>
					</td>
				)}
				{
					(headers.map((header, idx) => (
						<TableCell
							obj={obj}
							header={header}
							idx={idx}
							key={idx}
						/>
					)))
				}
			</tr>
			{category?.sublistKey && obj[category.sublistKey] && isSubUnwrapped &&
				obj[category.sublistKey]["data"].map((child, idx) => (
					<tr className="data-table-tr-child" style={style} key={`child-${idx}`}>
						<td></td>
						{headers.map((header, idx) => (
							<TableCell
								isSublist
								obj={child}
								header={header}
								idx={idx}
								key={idx}
							/>
						))}
					</tr>
			))}

		</>
	)
}

const ASABTable = ({
	data, headers,
	rowStyle, rowClassName, category,
	collapseChildren, toggleChildrenOnRowClick
}) => (
	<Table hover responsive className="datatable">
		<Headers sublists={!!category} headers={headers} />
		<tbody className="data-table-tbody">
			{data && data.map((obj, idx) => (
				<TableRow {...{ obj, headers, rowStyle, rowClassName, category, collapseChildren, toggleChildrenOnRowClick }} key={idx} />
			))}
		</tbody>
	</Table>
);

export default ASABTable;
