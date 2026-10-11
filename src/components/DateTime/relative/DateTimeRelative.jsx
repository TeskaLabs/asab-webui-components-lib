import React from 'react';

import { getFormattedTimeRelative } from './getFormattedTimeRelative.jsx';
import useDateFNSLocale from '../utils/useDateFNSLocale';
import { InvalidDate } from '../components/InvalidDate.jsx';

// Component that displays the relative time and shows the absolute time on hover
export function DateTimeRelative(props) {
	if (props.value == undefined) {
		return (
			<span className='datetime'>{' '}</span>
		);
	}

	return <DateTimeRelativeValue {...props} />;
}

// DateTime relative value component with hooks
function DateTimeRelativeValue(props) {
	const locale = useDateFNSLocale();
	const date = getFormattedTimeRelative(props.value, props.dateTimeFormat, props.addSuffix, locale);

	// Check for invalid date from getFormattedTimeRelative method
	if (date.date === 'Invalid Date') {
		return (
			<InvalidDate value={props.value} />
		);
	}

	return (
		<span
			className='datetime text-nowrap'
			title={date.absoluteTime}
		>
			<i className='bi bi-clock pe-1' />
			{date.date}
		</span>
	);
}
