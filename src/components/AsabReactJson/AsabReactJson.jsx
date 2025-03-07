import React from 'react';

import ReactJson from 'react-json-view';
import { useSelector } from 'react-redux';

// Component wraps ReactJson to handle BigInt numbers and turn them into strings
export const AsabReactJson = ({src, ...props}) => {
	const theme = useSelector(state => state.theme);

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
		<ReactJson
			src={convertBigIntToString((src))}
			theme={(theme === 'dark') ? 'chalk' : 'rjv-default'}
			{...props}
		/>

	)
};
