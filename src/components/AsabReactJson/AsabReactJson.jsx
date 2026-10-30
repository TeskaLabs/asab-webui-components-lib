import React, { useMemo } from 'react';

import { JsonEditor, JsonViewer } from 'json-edit-react';
import { githubDarkTheme, githubLightTheme } from '@json-edit-react/themes';
import { useAppSelector } from '../Context/store/AppStore.jsx';

/*
	Props to pass on for AsabReactJson:
		src - This property contains your input JSON
		...props - JsonEditor / JsonViewer props (https://github.com/CarlosNZ/json-edit-react)
		Plus v1 compatibility aliases mapped in this wrapper:
			viewOnly, enableClipboard, rootFontSize, showArrayIndices,
			customNodeDefinitions.element, collapsed, indentWidth
*/

// Displays data types for string, number and boolean values.
const displayDataTypeDefinition = {
	condition: ({ value }) => ['string', 'number', 'boolean'].includes(typeof value),
	passOriginalNode: true,
	showOnView: true,
	showOnEdit: false,
	component({ originalNode, nodeData, getStyles }) {
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

const mapCustomNodeDefinitions = (definitions) => {
	if (!definitions) {
		return undefined;
	}
	return definitions.map((definition) => {
		const {
			element,
			component,
			customKey,
			keyComponent,
			customNodeProps,
			componentProps,
			hideKey,
			showKey,
			showInTypesSelector,
			showInTypeSelector,
			...rest
		} = definition;
		return {
			...rest,
			component: component ?? element,
			...(keyComponent !== undefined || customKey !== undefined
				? { keyComponent: keyComponent ?? customKey }
				: {}),
			...(componentProps !== undefined || customNodeProps !== undefined
				? { componentProps: componentProps ?? customNodeProps }
				: {}),
			...(showKey !== undefined || hideKey !== undefined
				? { showKey: showKey ?? !hideKey }
				: {}),
			...(showInTypeSelector !== undefined || showInTypesSelector !== undefined
				? { showInTypeSelector: showInTypeSelector ?? showInTypesSelector }
				: {}),
		};
	});
};

// Component wraps JsonEditor/JsonViewer to handle BigInt numbers and turn them into strings
export const AsabReactJson = ({
	src,
	displayDataTypes = false,
	// v1 defaults / aliases — most call sites are read-only viewers
	viewOnly = true,
	setData,
	enableClipboard,
	showClipboardButton,
	rootFontSize = '14px',
	baseFontSize,
	showArrayIndices,
	showArrayIndexes,
	customNodeDefinitions,
	collapse,
	collapsed,
	indent,
	indentWidth,
	style,
	// Legacy react-json-view leftovers (ignored by json-edit-react)
	name: _name,
	displayArrayKey: _displayArrayKey,
	quotesOnKeys: _quotesOnKeys,
	...props
}) => {
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

	const resolvedCustomNodeDefinitions = useMemo(() => {
		if (customNodeDefinitions) {
			return mapCustomNodeDefinitions(customNodeDefinitions);
		}
		return displayDataTypes ? [displayDataTypeDefinition] : undefined;
	}, [customNodeDefinitions, displayDataTypes]);

	const commonProps = {
		data: convertBigIntToString(src),
		customNodeDefinitions: resolvedCustomNodeDefinitions,
		maxWidth: '100%',
		// Preserve v1 fully-expanded default unless callers override
		collapse: collapse ?? collapsed ?? false,
		baseFontSize: baseFontSize ?? rootFontSize,
		showClipboardButton: showClipboardButton ?? enableClipboard ?? true,
		showArrayIndexes: showArrayIndexes ?? showArrayIndices,
		indent: indent ?? indentWidth,
		theme: [
			theme === 'dark' ? githubDarkTheme : githubLightTheme,
			{
				container: {
					backgroundColor: 'var(--bs-card-bg)',
					padding: '0 1.5rem 0.5rem',
					// v1 call sites sometimes passed DOM `style` (e.g. overflow)
					...(style || {}),
				},
			},
		],
		...props,
	};

	// Drop undefined so JsonEditor defaults stay intact
	Object.keys(commonProps).forEach((key) => {
		if (commonProps[key] === undefined) {
			delete commonProps[key];
		}
	});

	const isReadOnly = viewOnly || typeof setData !== 'function';

	if (isReadOnly) {
		return <JsonViewer {...commonProps} />;
	}

	return (
		<JsonEditor
			{...commonProps}
			setData={setData}
			allowEdit={!viewOnly}
			allowAdd={!viewOnly}
			allowDelete={!viewOnly}
		/>
	);
};
