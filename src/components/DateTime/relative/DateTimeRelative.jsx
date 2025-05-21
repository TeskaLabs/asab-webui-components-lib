import React from 'react';

import { timeToStringRelative } from './timeToStringRelative.jsx';
import useDateFNSLocale from '../utils/useDateFNSLocale';
import { InvalidDate } from '../components/InvalidDate.jsx';

// Component that displays the relative time and shows the absolute time on hover
export function DateTimeRelative(props) {
	if (props.value == undefined) {
		return (
			<span className='datetime'>{' '}</span>
		);
	}

	// Declaration of locale must be below span returned for `undefined` values to avoid bad react state handling in useDateFNSLocale
	const locale = useDateFNSLocale();

	const date = timeToStringRelative(props.value, props.dateTimeFormat, props.addSuffix, locale);

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
