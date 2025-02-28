import React from 'react';

import ReactJson from 'react-json-view';
import { useSelector } from 'react-redux';

export const AsabReactJson = ({src, ...props}) => {
	const theme = useSelector(state => state.theme);

	// TODO: need to find a way how to do this nicely
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
