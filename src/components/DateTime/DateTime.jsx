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
	// Return 'Invalid Date' if the input is null or undefined
	if (value == null) {
		return 'Invalid Date';
	}

	// Handle BigInt values explicitly
	if (typeof value === 'bigint') {
		// SP-Lang datetime format is represented as BigInt
		return splDatetimeToIso(value);
	}

	// Handle string values
	if (typeof value === 'string') {
		const parsed = new Date(value); // Try to parse the string into a Date object
		// If the parsed date is invalid, return 'Invalid Date'; otherwise, return the date
		return isNaN(parsed.getTime()) ? 'Invalid Date' : parsed;
	}

	// Handle number values
	if (typeof value === 'number') {
		// Reject infinite, NaN, or negative numbers
		if (!Number.isFinite(value) || value < 0) {
			return 'Invalid Date';
		}

		// Consider numbers ≥ 1e17 as SP-Lang datetime format
		if (value >= 1e17) {
			// Convert number to BigInt and parse as SP-Lang datetime
			return splDatetimeToIso(BigInt(value));
		}

		// Handle Unix timestamp in seconds (less than 1e10)
		if (value < 1e10) {
			return new Date(value * 1000); // Convert seconds to milliseconds
		}

		// Handle timestamps in milliseconds (less than 1e13)
		if (value < 1e13) {
			return new Date(value); // Already in milliseconds
		}

		// Handle timestamps in microseconds (less than 1e16)
		if (value < 1e16) {
			return new Date(value / 1000); // Convert microseconds to milliseconds
		}

		// Numbers that don't fall into any known range are considered invalid
		return 'Invalid Date';
	}

	// All other types are unsupported and result in 'Invalid Date'
	return 'Invalid Date';
}