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

	return <DateTimeValue {...props} />;
}

// DateTime value component with hooks
function DateTimeValue(props) {
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
