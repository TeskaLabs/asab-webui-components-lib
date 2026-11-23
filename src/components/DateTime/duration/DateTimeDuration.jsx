import React from 'react';

import { getFormattedTimeDuration } from './getFormattedTimeDuration.js';

/*
	Component that displays a duration (delta time in seconds) in a human
	readable form (e.g. "1h 10m 5s") and shows the raw value on hover
*/
export function DateTimeDuration(props) {
	if (props.value == undefined) {
		return (
			<span className='datetime'>{' '}</span>
		);
	}

	return <DateTimeDurationValue {...props} />;
}

// DateTime value component with hooks
function DateTimeDurationValue(props) {
	const duration = getFormattedTimeDuration(props.value);

	// Check for invalid value from getFormattedTimeDuration method
	if (duration.duration === 'Invalid value') {
		return (
			<InvalidDate value={props.value} />
		);
	}

	return (
		<span
			className='datetime text-nowrap'
			title={duration.value} // Show the raw value (in seconds) on hover
		>
			<i className='bi bi-watch pe-1' />
			{duration.duration}
		</span>
	);
}
