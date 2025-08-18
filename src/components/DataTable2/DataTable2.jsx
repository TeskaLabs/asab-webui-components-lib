import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
	Table,
	CardBody, CardHeader, CardFooter,
	Dropdown, DropdownToggle, DropdownItem, DropdownMenu,
	Badge
} from 'reactstrap';

import { usePubSub } from '../Context/PubSubContext';
import { DataTableContextProvider, useDataTableContext } from './DataTableContext.jsx';

import './DataTable2.scss';

// Wrapper for datatable context
export function DataTableCard2({ columns, loader, loaderParams, header, className, initialLimit = 0, rowHeight = 38, disableParams = undefined, hideFooter = false, rowStyle }) {
	return (
		<DataTableContextProvider disableParams={disableParams} initialLimit={initialLimit}>
			<DataTableCardContent
				columns={columns}
				loader={loader}
				loaderParams={loaderParams}
				header={header}
				className={className}
				rowHeight={rowHeight}
				rowStyle={rowStyle}
				hideFooter={hideFooter}
			/>
		</DataTableContextProvider>
	);
}


function DataTableCardContent({ columns, loader, loaderParams, header, className, rowHeight, rowStyle, hideFooter }) {
	// Getting application object and PubSub subscription
	const { app, subscribe } = usePubSub();
	const { watchParams, getParam, setParams, serializeParams } = useDataTableContext();

	const [ rows, setRows ] = useState([]);
	const [ count, setCount ] = useState(0);
	const [ isLoading, setLoading ] = useState(true);

	const cardRef = useRef(null);
	const timeoutRef = useRef(null);

	const { t } = useTranslation();

	const loadRows = async ({ transparentReload = undefined } = {}) => {
		if (getParam('i') == 0) {
			setLoading(false);
			return;
		}
		// Display loading placeholders when transparent reload is undefined
		if (!transparentReload) {
			setLoading(true);
		}

		const params = serializeParams();
		try {
			/*
				For simple DataTable cases - return { count, rows } from loader;
				For Websocket or advanced cases - use state hook for setRows(data.rows) and setCount(data.count) in loader;
			*/
			const ret = await loader({ params, loaderParams, setRows, setCount });
			if (ret != undefined) {
				const { count, rows } = ret;
				// Validation on rows type. If not an array, it will fallback to the defaults.
				if (!Array.isArray(rows)) {
					setRows([]);
					setCount(0);
					app.addAlert('danger', t('General|Failed to load rows to the data table. Rows are of unsupported type {{type}}.', { type: typeof rows }));
					return;
				}
				setRows(rows);
				setCount(count);
			}
		}
		catch (e) {
			app.addAlertFromException(e, t('General|Failed to load rows to the data table'));
			setRows([]);
			setCount(0);
		}
		finally {
			setLoading(false);
			calculateAndSetColumnWidths();
		}
	}

	// Load rows on search params change
	useEffect(() => {
		// Load rows on every parameter change when limit is bigger than 0
		if (getParam('i') > 0) {
			// Load rows when filter is undefined or empty string
			if ((getParam('f') == undefined) || (getParam('f') == '')) {
				// Clear the timeout if filter value is empty to avoid race condition
				if (timeoutRef.current !== null) {
					clearTimeout(timeoutRef.current);
					timeoutRef.current = null;
				}
				loadRows();
			}
			/*
				Load rows with timeout on cases where filter is not undefined
				and its not an empty string. It avoid triggering requests to service
				on every filter change and thus overloading the service.
			*/
			if ((getParam('f') != '') && (getParam('f') != undefined)) {
				if (timeoutRef.current !== null) {
					clearTimeout(timeoutRef.current);
				}
				timeoutRef.current = setTimeout(() => {
					timeoutRef.current = null;
					loadRows();
				}, 500);
			}
		} else {
			/*
				Compute rows when we loose the information about the limit.

				This prevents the NaN issues with DataTable and helps to redirect to a
				initial page when clicking the same route sidebar item.
			*/
			const height = cardRef.current.parentElement.getBoundingClientRect().height;
			const rows = Math.max(Math.floor((height - 200 /*header and footer overhead*/) / rowHeight /* row height */), 5);
			setParams({ p: 1, i: rows }, true);
		}

		/*
			Subscription to Application.reload! message.
			DataTable will be reloaded for particular search params
			when the `Application.reload!` message will be published
			in any of the parent/children components
		*/
		const subscription = subscribe('Application.reload!', (message) => {
			/*
				TODO: use message passed from the published event to distinguish between tables
				if there is more than 1 on the screen
			*/
			if (message?.mode === 'transparent') {
				// Use transparent reloading
				loadRows({transparentReload: true});
			} else {
				loadRows();
			}
		});
		// Clean up subscription on component unmount / params change
		return () => {
			subscription();
		};
		// TODO: .catch(console.error);
	}, [watchParams, loaderParams]);

	useEffect(() => {
		// Automatically determine limit based on the free space in the parent container
		if (cardRef.current) {
			const height = cardRef.current.parentElement.getBoundingClientRect().height;
			const rows = Math.max(Math.floor((height - 200 /*header and footer overhead*/) / rowHeight /* row height */), 5);
			if (getParam('i') == 0) {
				setParams({ i: rows }, true); // Replace the navigation during the DataTable initialization to avoid removal of search params when navigating back in history
			}
		}
		// Clearing a cardRef after exiting a component
		return () => {
			cardRef.current = null;
		};
	}, [cardRef]);

	// Calculate and set new column widths
	const calculateAndSetColumnWidths = () => {
		if (cardRef.current != null) {
			const columns = cardRef.current.querySelectorAll('th');
			const newWidth = {};
			columns.forEach(column => {
				const { id, offsetWidth } = column;
				newWidth[id] = offsetWidth;
				if (newWidth.hasOwnProperty(id)) {
					column.style.width = `${newWidth[id]}px`;
				}
			});
		}
	};

	return (
		<div className="card" ref={cardRef}>
			<CardHeader className="card-header-flex">
				{header}
			</CardHeader>
			<CardBody className='datatable2-card-body'>
				<DataTableCardPill2 isLoading={isLoading} rowHeight={rowHeight}/>
				{isLoading
					? <DataTable2
						columns={columns}
						rows={Array(getParam('i') ? getParam('i') : 10).fill({})} // Simulate rows
						limit={getParam('i')}
						loading
						rowHeight={rowHeight}
						rowStyle={rowStyle}
					/>
					: <DataTable2
						columns={columns}
						rows={rows}
						limit={getParam('i')}
						rowHeight={rowHeight}
						rowStyle={rowStyle}
					/>
				}
			</CardBody>
			{!hideFooter &&
			<DataTableCardFooter2
				page={getParam('p')}
				limit={getParam('i')}
				count={count}
				rows={rows}
				isLoading={isLoading}
			/>}
		</div>
	);
}

export function DataTableCardFooter2({page, limit, count, rows, isLoading}) {
	const { getParam, setParams } = useDataTableContext();
	const { t } = useTranslation();
	const [ isLimitDropDownOpen, setLimitDropDownOpen ] = useState(false);
	const limitValues = [10, 20, 50, 100];

	const nextPage = () => {
		if ((count == undefined) && (limit === rows.length)) {
			setParams({p: page + 1});
			return;
		}

		if (page < Math.ceil(count / limit)) {
			setParams({p: page + 1});
		}
	};

	const prevPage = () => {
		if (page > 1) {
			setParams({p: page - 1});
		}
	}

	const setLimitValue = (value) => {
		setParams({p: 1, i: value});
	}

	return (
		<CardFooter className="card-footer-flex">
			<div className="border-end flex-fill">
				{(count != undefined) &&
					`${1 + (page - 1) * limit} - ${Math.min(limit + (page - 1) * limit, count)} ${t('General|of')} ${count} ${t('General|item(s)')}`
				}
			</div>
			<div className="border-end">
				{`${t('General|Page')}: ${page}`}
				{(count != undefined) &&
					` ${t('General|of')} ${Math.ceil(count / limit)} ${t('General|page(s)')}`
				}
			</div>

			<div className='pe-0'>
				{t("General|Items per page")}:
			</div>
			<Dropdown
				className="border-end"
				toggle={() => setLimitDropDownOpen(!isLimitDropDownOpen)}
				isOpen={isLimitDropDownOpen}
				direction="up"
			>
				<DropdownToggle outline caret>
					{!isNaN(limit) ? limit : 0}
				</DropdownToggle>
				<DropdownMenu>
				{
					limitValues.map((value, idx) => <DropdownItem onClick={() => {
						setLimitValue(value)
					}} key={idx}>{value}</DropdownItem>)
				}
				</DropdownMenu>
			</Dropdown>
			<button disabled={isLoading} type="button" className="btn btn-outline-secondary" onClick={prevPage}>
				<i className="bi bi-chevron-double-left" />
			</button>
			<button disabled={isLoading} type="button" className="btn btn-outline-secondary" onClick={nextPage}>
				<i className="bi bi-chevron-double-right" />
			</button>
		</CardFooter>
	);
}


export function DataTable2({columns, rows, limit, loading, rowHeight, rowStyle}) {
	return (
		<Table className="datatable2 placeholder-glow">
			<colgroup>
				{columns.map((column, idx) => (
					<col key={idx} style={column?.colStyle}/>
				))}
			</colgroup>

			<thead>
				<tr>
					{columns.map((column, idx) => (
						<th key={idx} style={column?.thStyle} className="pt-0" id={`datatable-column-${idx}`}>
							{column?.sort ?
								<DataTableSort2
									title={column?.title}
									field={column.sort}
								/>
							: column?.title}
						</th>

					))}
				</tr>
			</thead>

			<tbody>
				{rows.map((row, ridx) => (
					<tr key={ridx} style={{ ...rowStyle ? rowStyle(row) : {}, height: rowHeight }}>
						{ loading
						? <td colSpan={columns.length}>
							<span className="placeholder w-100 bg-secondary"></span>
						</td>
						: columns.map((column, cidx) =>
							<td key={cidx} style={column?.tdStyle}>
								{ (column?.render != undefined)
								? column.render({row, column, ridx})
								: <span className="placeholder w-100 bg-secondary" title="Missing render method"></span>
								}
							</td>
						)}
					</tr>
				))}
			</tbody>

			{(limit - rows.length > 0) && <tfoot /* This is rendering of the empty rows to make height of table fixed */>
				{Array(limit - rows.length).fill(0).map((_, ridx) => (
					<tr key={"e"+ridx} style={{height: rowHeight}}>
						<td colSpan={columns.length}>&nbsp;</td>
					</tr>
				))}
			</tfoot>}
		</Table>
	);

}

// Renders filter pills based on data table filter params
function DataTableCardPill2({isLoading, rowHeight}) {
	const { getParam, watchParams, getAllParams, removeSinglePill, removeMultiPill, getFilterField, getCustomPill } = useDataTableContext();
	const { t } = useTranslation();
	const displayPillArea = useMemo(() => {
		if (getAllParams() && Object.keys(getAllParams()).some(key => key.startsWith('a'))) {
			return true;
		} else {
			return false;
		}
	}, [watchParams]);

	return(
		displayPillArea &&
		<div className="datatable-cardpill-area" style={{minHeight: rowHeight}}>
			{Object.keys(getAllParams()).map((key) => {
				if (key.startsWith("a")) {
					const value = getParam(key, {splitBy: ','});
					return (
						(value.length > 1) ?
							value.map(val => (
								<span
									key={`${key}${val}`}
									className="datatable-cardpill mx-1"
								>
									<BadgeRenderer/>
								</span>
							))
						:
							<span
								key={`${key}${value}`}
								className="datatable-cardpill mx-1"
							>
								<Badge color="primary" pill>
									{`${getFilterField(key.substring(1))}: ${getUsernameOrValue(value)}`}
									{(isLoading == true) ?
										<i
											className="bi bi-x ps-1"
											title={t('General|Remove')}
										/>
									:
										<i
											className="bi bi-x ps-1 datatable-cardpill-icon"
											title={t('General|Remove')}
											onClick={() => removeSinglePill(key)}
										/>
									}
								</Badge>
							</span>
					)
				} else {
					return null;
				}
			})}
		</div>
	)
}

function BadgeRenderer({item, value, isLoading}) {
	const { removeMultiPill, getFilterField, getCustomPill } = useDataTableContext();
	const { t } = useTranslation();

	const CustomBadge = getCustomPill(item)
	return (
		<Badge color="primary" pill>
			{CustomBadge ? CustomBadge : `${getFilterField(item.substring(1))}: ${value}`}
			{(isLoading == true) ?
				<i
					className="bi bi-x ps-1"
					title={t('General|Remove')}
				/>
			:
				<i
					className="bi bi-x ps-1 datatable-cardpill-icon"
					title={t('General|Remove')}
					onClick={() => removeMultiPill(item, value)}
				/>
			}
		</Badge>
	)
}

// Inner sorting function
function DataTableSort2({title, field}) {
	const { onTriggerSort, getParam } = useDataTableContext();
	const { t } = useTranslation();

	return (
		getParam(`s${field}`) ?
			(getParam(`s${field}`) == "d") ?
				<span className="sort-span-wrapper" onClick={(e) => onTriggerSort(e, field, "a")}>
					{title}
					<i
						title={`${t('General|Sort ascend')}. ${t('General|Shift + left mouse click to remove from sorting')}`}
						className="bi bi-sort-up sort-icon-active ms-2"
					></i>
				</span>
				:
				<span className="sort-span-wrapper" onClick={(e) => onTriggerSort(e, field, "d")}>
					{title}
					<i
						title={`${t('General|Sort descend')}. ${t('General|Shift + left mouse click to remove from sorting')}`}
						className="bi bi-sort-down-alt sort-icon-active ms-2"
					></i>
				</span>
			:
				<span className="sort-span-wrapper" onClick={(e) => onTriggerSort(e, field, "a")}>
					{title}
					<i
						title={t('General|Shift + left mouse click for advanced sorting')}
						className="bi bi-arrow-down-up ms-2"
					></i>
				</span>
	)
}
