import React from 'react';

import timeToString from './timeToString';
import useDateFNSLocale from './useDateFNSLocale';
import InvalidDate from './InvalidDate.jsx';

// Component that displays the relative time and shows the absolute time on hover
export function RelativeDateTime(props) {
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
			title={date.date}
		>
			<i className='bi bi-clock pe-1' />
			{date.distanceToNow}
		</span>
	);
}
