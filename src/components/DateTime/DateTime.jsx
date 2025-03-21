import React from 'react';

import timeToString from './timeToString.js';
import useDateFNSLocale from './useDateFNSLocale.js';
import { InvalidDate } from './InvalidDate.jsx';

// Component that displays the absolute time and shows the relative time on hover
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
