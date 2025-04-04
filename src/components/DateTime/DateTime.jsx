import React from 'react';

import timeToString from './timeToString.js';
import useDateFNSLocale from './useDateFNSLocale.js';
import { InvalidDate } from './InvalidDate.jsx';
import { splDatetimeToIso } from './splDatetimeToIso';

// Component that displays the absolute time and shows the relative time on hover
export function DateTime(props) {
	if (props.value == undefined) {
		return (
			<span className='datetime'>{' '}</span>
		);
	}

	// Declaration of locale must be below span returned for `undefined` values to avoid bad react state handling in useDateFNSLocale
	const locale = useDateFNSLocale();

	const datetime = validateDateTime(props.value);

	if (datetime.toString() === 'Invalid Date') {
		return (
			<InvalidDate />
		);
	}

	const date = timeToString(datetime, props.dateTimeFormat, locale);

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

function validateDateTime(value) {
	if (value == null) return 'Invalid Date';

	// Reject non-numeric values
	if ((typeof value !== 'number') || !Number.isFinite(value)) return new Date(value);

	// Reject negative numbers (timestamps are always positive)
	if (value < 0) return 'Invalid Date';

	// SP-Lang datetime (BigInt or number >= 10^17)
	if (typeof value === 'bigint' || value >= 10n ** 17n) {
		return splDatetimeToIso(BigInt(value));
	}

	// Defining the time format by range
	if (value < 1e10) return new Date(value * 1000); // Seconds → milliseconds
	if (value < 1e13) return new Date(value); // Milliseconds
	if (value < 1e16) return new Date(value / 1000); // Microseconds

	return 'Invalid Date';
}