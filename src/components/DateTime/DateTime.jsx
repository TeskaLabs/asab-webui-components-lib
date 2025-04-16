import React from 'react';

import timeToString from './timeToString.js';
import useDateFNSLocale from './useDateFNSLocale.js';
import { InvalidDate } from './InvalidDate.jsx';
import { splDatetimeToIso } from './splDatetimeToIso';

// Component that displays the absolute time and shows the relative time on hover
export function DateTime(props) {
	console.log(props)
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
	if (value == null) {
		return 'Invalid Date';
	}

	console.log(typeof value )

	// Обработка BigInt сразу
	if (typeof value === 'bigint') {
		// SP-Lang datetime (BigInt всегда)
		return splDatetimeToIso(value);
	}

	// Обработка строк
	if (typeof value === 'string') {
		const parsed = new Date(value);
		return isNaN(parsed.getTime()) ? 'Invalid Date' : parsed;
	}

	// Обработка чисел
	if (typeof value === 'number') {
		if (!Number.isFinite(value) || value < 0) {
			return 'Invalid Date';
		}

		// Очень большие числа — SP-Lang (возможно ошибка, но ты сам решаешь как обрабатывать)
		if (value >= 1e17) {
			return splDatetimeToIso(BigInt(value));
		}

		if (value < 1e10) {
			return new Date(value * 1000); // секунды
		}
		if (value < 1e13) {
			return new Date(value); // миллисекунды
		}
		if (value < 1e16) {
			return new Date(value / 1000); // микросекунды
		}

		// Слишком большие числа, не распознали
		return 'Invalid Date';
	}

	return 'Invalid Date';
}
