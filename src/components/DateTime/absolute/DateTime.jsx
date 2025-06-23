import React from 'react';

import getFormattedTime from './getFormattedTime.js';
import useDateFNSLocale from '../utils/useDateFNSLocale.js';
import { InvalidDate } from '../components/InvalidDate.jsx';

// Component that displays the absolute time and shows the relative time on hover
export function DateTime(props) {
	if (props.value == undefined) {
		return (
			<span className='datetime'>{' '}</span>
		);
	}

	// Declaration of locale must be below span returned for `undefined` values to avoid bad react state handling in useDateFNSLocale
	const locale = useDateFNSLocale();

	const date = getFormattedTime(props.value, props.dateTimeFormat, locale);

	// Check for invalid date from getFormattedTime method
	if (date.date === 'Invalid Date') {
		return (
			<InvalidDate value={props.value} />
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
