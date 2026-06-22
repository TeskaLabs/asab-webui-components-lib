import React from 'react';

import { JsonEditor, githubDarkTheme, githubLightTheme } from 'json-edit-react';
import { useAppSelector } from '../Context/store/AppStore.jsx';

/*
	Props to pass on for AsabReactJson:
		src - This property contains your input JSON
		...props - all the props that can be passed to JsonEditor (https://github.com/CarlosNZ/json-edit-react#props-reference)
*/

// Displays data types for string, number and boolean values.
const displayDataTypeDefinition = {
	condition: ({ value }) => ['string', 'number', 'boolean'].includes(typeof value),
	passOriginalNode: true,
	showOnView: true,
	showOnEdit: false,
	element({ originalNode, nodeData, getStyles }) {
		const dataType = typeof nodeData.value;
		const { color } = getStyles(dataType, nodeData);
		return (
			<span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.35rem' }}>
				<span style={{ fontSize: '0.7em', color }}>{dataType}</span>
				{originalNode}
			</span>
		);
	},
};

// Component wraps JsonEditor to handle BigInt numbers and turn them into strings
export const AsabReactJson = ({src, displayDataTypes = false, ...props}) => {
	const theme = useAppSelector(state => state.theme);

	// The function looks through the received data and if there is a BigInt there, it transforms it into a string
	const convertBigIntToString = (data) => {
		if (typeof data === 'bigint') {
			return data.toString();
		} else if (Array.isArray(data)) {
			return data.map(item => convertBigIntToString(item)); // Recursion for array
		} else if ((typeof data === 'object') && (data !== null)) {
			return Object.fromEntries(
				Object.entries(data).map(([key, value]) => [key, convertBigIntToString(value)]) // Recursion for an object
			);
		}
		return data;
	};

	return (
		<JsonEditor
			data={convertBigIntToString(src)}
			customNodeDefinitions={displayDataTypes ? [displayDataTypeDefinition] : undefined}
			viewOnly={true}
			maxWidth="100%"
			rootFontSize="14px"
			theme={[
				theme === 'dark' ? githubDarkTheme : githubLightTheme,
				{
					container: {
						backgroundColor: 'var(--bs-card-bg)',
						padding: '0 1.5rem 0.5rem',
					},
				}
			]}
			{...props}
		/>
	)
};
