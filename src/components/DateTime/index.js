import React from 'react';

import timeToString from './timeToString';
import useDateFNSLocale from './useDateFNSLocale';
import { splDatetimeToIso } from './splDatetimeToIso';

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

// Method for rendering invalid date component
function InvalidDate(props) {
	return (
		<span className='datetime text-nowrap'>
			<i className='bi bi-clock pe-1' />
			Invalid Date
		</span>
	);
}

// Function to distribute the time value depending on the condition if it is a BigInt or other value
function validateDateTime(value) {
	// If it's already a BigInt, it's a valid BigInt timestamp
	if (typeof value === 'bigint') return splDatetimeToIso(value);
	// Reject non-numeric values
	if (typeof value !== 'number' || !Number.isFinite(value)) return new Date(value);

	// Reject negative numbers (timestamps are always positive)
	if (value < 0) return 'Invalid Date';

	// If it's a safe integer and a typical Unix timestamp, it's NOT BigInt
	if (Number.isInteger(value)) {
		// Unix timestamp in SECONDS (typically 10 digits, < 1e12)
		if (value < 1e12) return new Date(value);

		// Unix timestamp in MILLISECONDS (typically 13 digits, < 1e15)
		if (value < 1e15) return new Date(value);

		// Anything beyond 10^15 is considered a BigInt timestamp
		return splDatetimeToIso(value);
	}

	// Return new Date for floating point values
	return new Date(value);
}
