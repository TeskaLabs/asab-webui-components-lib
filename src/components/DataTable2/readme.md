# DataTable2

Use:

```
<DataTableCard2
	app={app}
	columns={columns}
	loader={loader}
	header={<Header />}
/>
```

Use with custom rowHeight of the table. Default value is `38`px.

```
<DataTableCard2
	app={app}
	columns={columns}
	loader={loader}
	header={<Header />}
	rowHeight={50}
/>
```

Use with custom rowHStyle of the table. Set styles using a row-specific condition.

**Note:** The `height` for rows cannot be set here. It is set using the rowHeight propagation and will be the same for all rows.

```
const rowStyle = (row) => {
	if (row.state === "finished") {
		return { "border": "3px yellow dotted" };
	}
	return null;
};
	
...

<DataTableCard2
	app={app}
	columns={columns}
	loader={loader}
	header={<Header />}
	rowStyle={rowStyle}
/>
```

To disable searchParams of the DataTable2, `disableParams={true}` is used to change the parameters handling from search parameters controlled situation to the inner state parameters control.

```
<DataTableCard2
	app={app}
	columns={columns}
	loader={loader}
	header={<Header />}
	disableParams={true}
/>
```

To remove footer from the DataTable2, `hideFooter={true}` should be set.

```
<DataTableCard2
	app={app}
	columns={columns}
	loader={loader}
	header={<Header />}
	hideFooter={true}
/>
```

## Columns

Provides info about columns in the data table

```
const columns = [
	{
		title: "Session",
		thStyle: {minWidth: "2rem"},
		render: ({ row }) =>
			<Link to={`/auth/session/${row._id}`}>
				{row._id}
			</Link>
	},
	{
		title: "Credentials",
		thStyle: {minWidth: "2rem"},
		render: ({ row }) =>
			<Link to={`/auth/credentials/${row.credentials_id}`}>
				{row.credentials_id}
			</Link>
	},
	{
		title: "Created at",
		thStyle: {minWidth: "4rem"},
		render: ({ row }) => <DateTime value={row._c}/>
	},
	{
		title: "Expected expiration",
		thStyle: {minWidth: "4rem"},
		render: ({ row }) => <DateTime value={row.expiration}/>
	},
	{
		thStyle: {width: "0px"}, // This is how you do the column for buttons
		tdStyle: {padding: "0px", whiteSpace: "nowrap"},
		render: ({ row, column }) => (<>
			<button className="btn btn-primary me-1" onClick={() => onYClick(row)}><i className="bi bi-check"></i></button>
			<button className="btn btn-danger" onClick={() => onXClick(row)}><i className="bi bi-trash"></i></button>
		</>)
	}
];
```

Use with sort:

```
import { DataTableCard2, DataTableSort2 } from "asab_webui_components";
...

const [sort, setSort] = useState([]);
...

const columns = [
	{
		title: "Session",
		thStyle: {minWidth: "2rem"},
		sort: "_id",
		render: ({ row }) =>
			<Link to={`/auth/session/${row._id}`}>
				{row._id}
			</Link>
	},
	{
		title: "Credentials",
		thStyle: {minWidth: "2rem"},
		sort: "credentials_id",
		render: ({ row }) =>
			<Link to={`/auth/credentials/${row.credentials_id}`}>
				{row.credentials_id}
			</Link>
	},
	{
		title: "Created at",
		thStyle: {minWidth: "4rem"},
		render: ({ row }) => <DateTime value={row._c}/>
	},
	{
		title: "Expected expiration",
		thStyle: {minWidth: "4rem"},
		render: ({ row }) => <DateTime value={row.expiration}/>
	},
	{
		thStyle: {width: "0px"}, // This is how you do the column for buttons
		tdStyle: {padding: "0px", whiteSpace: "nowrap"},
		render: ({ row, column }) => (<>
			<button className="btn btn-primary me-1" onClick={() => onYClick(row)}><i className="bi bi-check"></i></button>
			<button className="btn btn-danger" onClick={() => onXClick(row)}><i className="bi bi-trash"></i></button>
		</>)
	}
];
```

## Loader

### Regular connection

Async function that loads rows from the backend.

```
const loader = async ({params}) => {
	params["tenant"] = currentTenant; // Example of adding a new item to API params
	let response = await ServiceAPI.get("/session", {params: params});
	const rows = response.data.data;
	const count = response.data.count;
	return { count, rows } ;
}
```

Alternatively with usage of setRows and setCount:

```
const loader = async ({params, setRows, setCount}) => {
	params["tenant"] = currentTenant; // Example of adding a new item to API params
	let response = await ServiceAPI.get("/session", {params: params});
	setRows(response.data.data);
	if (response.data.count != undefined) {
		setCount(response.data.count);
	} else {
		setCount(response.data.data.length);
	}
}
```

### Websocket connection

```
const WSClientRef = useRef(null); // Websocket client reference
const isMounted = useRef(null); // Reference to mounted component (checking whether the component is still mounted before establishing a new websocket connection)

useEffect(() => {
	isMounted.current = true;
	return () => {
		onClose();
		isMounted.current = false;
	};
}, []);

// Reusable method to close websocket connection
const onClose = () => {
	if (WSClientRef.current != null) {
		try {
			WSClientRef.current.close();
		} catch (e) {
			console.log("Ignored exception: ", e);
		}
		WSClientRef.current = null;
	}
}

// Websocket loader for DataTable
const loader = async ({ params, setRows, setCount }) => {
	// Check if the component is still mounted before creating a new WebSocket connection
	if (isMounted.current === false) {
		return ;
	}
	// Convert params from object to URL params
	params = new URLSearchParams(params);

	onClose();

	new Promise((resolve, reject) => {
		// Check if the component is still mounted before creating a new WebSocket connection
		if (isMounted.current === false) {
			return;
		}

		const WSClient = props.app.createWebSocket('service-name', `/ws?${params}`);
		WSClientRef.current = WSClient;

		// Handler for opening the websocket connection
		const openHandler = () => {
			setErrorMsg(undefined);
			resolve(WSClient);
		};

		// Handler for processing the websocket messages
		const messageHandler = (message) => {
			/*
				Websocket data are usually received in the message as a string,
				so it is important to parse the data and validate if the data are
				in desired format (e.g. JSON) before parsing
			*/
			if (isJSON(message.data) == true) { // Some custom method for validating if the data are parsable
				const retrievedData = JSON.parse(message.data);
				setRows(retrievedData.data ? retrievedData.data : []);
				setCount(retrievedData.count ? retrievedData.count : 0);
			}
		};

		// Handler for processing the errors of websocket connection
		const errorHandler = (error) => {
			setRows([]);
			setCount(0);
			onClose();
			// Attempting reconnection every 5 seconds
			const reconnectTimeout = setTimeout(() => {
				loader({ params, setRows, setCount });
			}, 5000);
			reject(error);

			// Cleanup: clear the timeout when loader is not needed anymore
			return () => {
				clearTimeout(reconnectTimeout);
			};
		};

		// Handler for closing the websocket connection
		const closeHandler = (event) => {
			reject(event);
		};

		WSClient.addEventListener('open', openHandler);
		WSClient.addEventListener('message', messageHandler);
		WSClient.addEventListener('error', errorHandler);
		WSClient.addEventListener('close', closeHandler);

		// Cleanup: remove event listeners when loader is not needed anymore
		return () => {
			WSClient.removeEventListener('open', openHandler);
			WSClient.removeEventListener('message', messageHandler);
			WSClient.removeEventListener('error', errorHandler);
			WSClient.removeEventListener('close', closeHandler);
		};
	});
}
```


## Header

Specifies the content of the card header (flex):

```
const Header = () => {
	return	(<>
		<div className="flex-fill">
			<h3>
				<i className="bi bi-stopwatch pe-2"></i>
				{t("SessionListContainer|Sessions")}
			</h3>
		</div>
		<button type="button" className="btn btn-danger">Terminate all</button>
	</>);
}
```

With filter:

```
import { DataTableCard2, DataTableFilter2 } from "asab_webui_components";

...

const Header = () => {
	return	(<>
		<div className="flex-fill">
			<h3>
				<i className="bi bi-stopwatch pe-2"></i>
				{t("SessionListContainer|Sessions")}
			</h3>
		</div>
		<DataTableFilter2 />
		<button type="button" className="btn btn-danger">Terminate all</button>
	</>);
}
```

With advanced filter (multi and single value):

```
import { DataTableCard2, DataTableFilter2, DataTableAdvFilterSingleValue2, DataTableAdvFilterMultiValue2 } from "asab_webui_components";

...

const [filterValues, setFilterValues] = useState(undefined);

const ServiceAPI = props.app.axiosCreate('service-name');

useEffect(() => {
	getFilterValues();
}, [])

// Data with specification for table advanced filering
const getFilterValues = async () => {
	try {
		const response = await ServiceAPI.get(`${tenant}/filter-values`);
		setFilterValues(response.data);
	} catch (e) {
		props.app.addAlertFromException(e, t("Failed to get filter specification, advanced filtering is not available"));
	}
}
...

const Header = () => {
	return	(<>
		<div className="flex-fill">
			<h3>
				<i className="bi bi-stopwatch pe-2"></i>
				{t("SessionListContainer|Sessions")}
			</h3>
		</div>
		<DataTableFilter2 />
		{(filterValues != undefined) && (Object.keys(filterValues).length > 0) &&
			<>
				<DataTableAdvFilterSingleValue2 field={{"severity": t("Severity")}} fieldItems={filterValues.severity}/>
				<DataTableAdvFilterMultiValue2 field={{"service_id": t("Service")}} fieldItems={filterValues.status}/>
			</>
		}
		<button type="button" className="btn btn-danger">Terminate all</button>
	</>);
}
```

## Reload state

If there is a need of reloading the table, e.g. due to the item removal, one can set the `reload` property of the `DataTableCard2`.
`reload` is a state. In top level screen, one can set it as in this example:

```
import { usePubSub } from 'asab_webui_components';

...

const { publish } = usePubSub();

...

const someFunctionRequiringReload = async (id) => {
	try {
		...
		publish('Application.reload!'); // Use the PubSub message to reload the table
	} catch(e) {
		...
	}
}

...

<DataTableCard2
	app={app}
	columns={columns}
	loader={loader}
	header={<Header />}
	...
/>
```

For **transparent** reload (reload without placeholders), use

`publish('Application.reload!', { mode: 'transparent' })`


## Other features

* Loading process indication
* Automated "limit" detection based on the size of the container
* `Shift + left mouse click` on column header allows to add column to advanced sorting (if sorting is applied in the table)
