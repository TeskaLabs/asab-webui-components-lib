# TreeMenuCard Documentation

The `TreeMenuCard` component is built on top of the `react-simple-tree-menu` library with additional props to enhance functionality. Below are the usage instructions and configuration details.

## Usage

```jsx
import { TreeMenuCard } from 'asab_webui_components';
...
<TreeMenuCard
	app={app}
	loader={loader}
/>
```

## Required Props

### `loader`
- **Description**: Asynchronous function that loads tree data from the backend.
- **Type**: `function`

**Example:**
```jsx
const loader = async () => {
	let response = await ServiceAPI.get('/treemenu');
	return response.data.data;
};
```
**Example of the data structure that Tree Menu expects:**
```
[
	{
		key: 'first-level-node-1',
		label: 'Node 1 at the first level',
		type: 'folder'
		nodes: [
			{
				key: 'second-level-node-1',
				label: 'Node 1 at the second level',
				type: 'folder'
				nodes: [
					{
						key: 'third-level-node-1',
						label: 'Node 1 at the second level',
						type: 'folder'
						nodes: [
							{
								key: 'fourth-level-node-1',
								label: 'Last node of the branch',
								type: 'file'
							},
						],
					},
				],
			},
		],
	},
	{
		key: 'first-level-node-2',
		label: 'Node 2 at the first level',
		type: 'file'
	},
];
```

## Optional Props

### `flatten` (optional)
- **Description**: Flattens the tree menu structure.
- **Type**: `boolean`
- **Default value**: `false`

**Example:**
```jsx
<TreeMenuCard
	app={app}
	loader={loader}
	flatten={true}
/>
```

**Example Tree Menu Structure Without Flattening:**
```
FolderName
	SubFolderName
		file.json
	file1.json
```

**Example Tree Menu Structure With Flattening:**
```
FolderName
	SubFolderName/file.json
	file1.json
```

### `hasSearch` (optional)
- **Description**: Enables search functionality within the tree menu.
- **Type**: `boolean`
- **Default value**: `false`

**Example:**
```jsx
<TreeMenuCard
	app={app}
	loader={loader}
	hasSearch={true}
/>
```

### `folderIcon` and `fileIcon` (optional)
- **Description**: Customize icons for folders and files.
- **Type**: `function`
- **Parameters**:
	- **`isOpen`**: A boolean that indicates if the folder is currently open (expanded). Useful for displaying different icons based on the open/closed state.
	- **`selected`**: A string that indicates if the item is currently selected (e.g., " selected"). This can be used for additional styling.

**Example:**
```jsx
<TreeMenuCard
	app={app}
	loader={loader}
	folderIcon={FolderIcon}
	fileIcon={FileIcon}
/>
```

**Usage:**
```jsx
const FolderIcon = (isOpen, selected) => {
	return (
		<i className={`${selected} ${isOpen ? 'bi bi-cloud-drizzle-fill' : 'bi bi-cloud-drizzle'} me-2`} />
	);
}

const FileIcon = () => {
	return (
		<i className='bi bi-balloon-heart me-2' />
	);
}
```

### `file` and `folder` (optional)
- **Description**: Customize the display and behavior of folders and files.
- **Type**: `function`
- **Parameters**:
	- **`label`**: A string representing the name or label of the folder or file. This is the text that will be displayed to the user.
	- **`parent`**: The parent node of the current item, which can be used to access the parent’s properties if needed.
	- **`type`**: A string value that indicates the type of the item, either "folder" or "file". This can be used to apply specific styling or logic based on the item type.
	- **`isDisabled`**: A boolean that indicates if the item should be rendered as disabled. This can be used to prevent user actions on certain items.

**Example:**
```jsx
<TreeMenuCard
	app={app}
	loader={loader}
	file={File}
	folder={Folder}
/>
```

**Usage:**
```jsx
const Folder = (label, parent, type, isDisabled) => {
	const onClickItem = () => {
		// Custom action on folder click
	};

	return <span onClick={onClickItem}>{label}</span>;
};

const File = (label, parent, type, isDisabled) => {
	const onClickItem = () => {
		// Custom action on file click
	};

	return <span onClick={onClickItem}>{label}</span>;
};
```

### `header` (optional)
- **Description**: Customize the content of the card header.
- **Type**: `function`

**Example:**
```jsx
<TreeMenuCard
	app={app}
	loader={loader}
	header={<Header />}
/>
```

**Usage:**
```jsx
const Header = () => {
	return (
		<div className='flex-fill'>
			<h3>
				<i className='bi bi-columns pe-2' />
				TreeMenuCard
			</h3>
		</div>
	);
};
```

### `disableNodeMemorySession` (optional)

- `bool` value
- Disable session memory for opened nodes. The nodes will be closed (formatted) to its initial state after every tree menu re-render.

**Example:**
```jsx
<TreeMenuCard
	app={app}
	loader={loader}
	disableNodeMemorySession={true}
/>
```

### `memorySessionName` (optional)

- `str` value
- Allows to specify the key to which will be the opened nodes stored for the particular session.
- The session memory of opened nodes depends on the location pathname. So this option is useful when the pathname changes on the screen where the treemenu is used and it is necessary to store the opened nodes.
- The opened nodes will be then saved under the particular name regardless the location pathname.

**Example:**
```jsx
<TreeMenuCard
	app={app}
	loader={loader}
	memorySessionName='/library'
/>
```

## Formatting Tree Data

### `formatIntoTree`
- **Description**: This function formats the retrieved data into a tree structure.

**Example:**
```jsx
import { TreeMenuCard, formatIntoTree } from 'asab_webui_components';

const loader = async () => {
	let response = await ServiceAPI.get('/treemenu');
	return formatIntoTree(response.data.data, '/CommonPath');
};
```

### `formatIntoLeafFolderTree`
- **Description**: This function filters the data to treat leaf folders as files in the tree structure.

**Example:**
```jsx
import { TreeMenuCard, formatIntoLeafFolderTree } from 'asab_webui_components';

const loader = async () => {
	let response = await ServiceAPI.get('/treemenu');
	return formatIntoLeafFolderTree(response.data.data, '/CommonPath');
};
```

### Example of Input Data
**Example of the input data to `formatIntoTree` and `formatIntoLeafFolderTree`:**
```
[
	{
		"name": "/Test/Path/",
		"type": "dir",
		"layer": 0
	},
	{
		"name": "/Test/PathExample/",
		"type": "dir",
		"layer": 0
	},
	{
		"name": "/Test/test-file.json",
		"type": "item",
		"layer": 0
	},
	{
		"name": "/Test/Path/test.json",
		"type": "item",
		"layer": 0
	},
	{
		"name": "/Test/PathExample/test1.json",
		"type": "item",
		"layer": 0
	},
]
```

### Note
- When none of the built-in formatters are suitable, you can create your own formatters according to your needs.

### `removeTreeContent`
- **Description**: This function filters the provided tree data, removing files and folders based on specified criteria.

**Example:**
```jsx
import { TreeMenuCard, formatIntoTree, removeTreeContent } from 'asab_webui_components';

const loader = async () => {
	let response = await ServiceAPI.get('/treemenu');
	const filteredData = removeTreeContent(response.data.data, {
		folders: ['Widgets', 'ExampleFolder'],
		files: ['Emails.yaml', 'TestFile.json'],
	});
	return formatIntoTree(filteredData, '/CommonPath');
};
```
