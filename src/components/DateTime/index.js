import React from 'react';

import timeToString from './timeToString';
import useDateFNSLocale from './useDateFNSLocale';

export function DateTime(props) {
	if (props.value == undefined) {
		return (
			<span className='datetime'>{' '}</span>
		);
	}

	// Declaration of locale must be below span returned for `undefined` values to avoid bad react state handling in useDateFNSLocale
	const locale = useDateFNSLocale();
	if (new Date(props.value).toString() === 'Invalid Date') {
		return (
			<InvalidDate />
		);
	}

	const date = timeToString(props.value, props.dateTimeFormat, locale);

	// Check for invalid date from timeToString method
	if (date === 'Invalid Date') {
		return (
			<InvalidDate />
		);
	}

	return (
		<span
			className='datetime text-nowrap'
			title={date.distanceToNow}
		>
			<i className='bi bi-clock pe-1' />
			{date.date}
		</span>
	);
}

// Mehod for rendering invalid date component
function InvalidDate(props) {
	return (
		<span className='datetime text-nowrap'>
			<i className='bi bi-clock pe-1' />
			Invalid Date
		</span>
	);
}
