import { format, parseISO, formatISO, formatDistanceToNow } from 'date-fns';
import { validateDateTime } from './validateDateTime.jsx';

// Common logic for both timeToString and timeToStringRelative
export const timeToStringCommon = (value, dateTimeFormat, locale, addSuffix) => {
	const invalidDate = { date: 'Invalid Date' };
	if (value == undefined) {
		return invalidDate;
	}

	const datetime = validateDateTime(value);

	if (datetime.toString() === 'Invalid Date') {
		return invalidDate;
	}

	if (new Date(datetime).toString() === "Invalid Date") {
		return invalidDate;
	}

	// TODO: uncomment to eventually add more defensiveness on dateTimeFormat
	// try {
	// 	format(datetime, dateTimeFormat);
	// } catch(e) {
	// 	console.error(`ASAB WebUI Components: DateTime - Invalid date time format ${dateTimeFormat}. The format is set to its default.`);
	// 	dateTimeFormat = "medium";
	// }

	let date;

	if (isNaN(datetime) == true) {
		// Checking dates for parsing
		if (parseISO(datetime) == "Invalid Date") {
			return invalidDate;
		} else {
			date = formatDate(parseISO(datetime), dateTimeFormat, locale, addSuffix);
		}
	} else {
		if (datetime > 9999999999) {
			date = formatDate(datetime, dateTimeFormat, locale, addSuffix);
		} else {
			date = formatDate(datetime * 1000, dateTimeFormat, locale, addSuffix);
		}
	}

	if (date.date === 'Invalid Date') {
		return invalidDate;
	}

	return { date: date.date, distanceToNow: date.distanceToNow };
}

const formatDate = (datetime, dateTimeFormat, locale, addSuffix) => {
	try {
		switch(dateTimeFormat) {
			case "long": return {date: format(datetime, 'PPpp', { locale }), distanceToNow: formatDistanceToNow(datetime, { addSuffix, locale: locale })};
			case "iso": return {date: formatISO(datetime), distanceToNow: formatDistanceToNow(datetime, { addSuffix, locale: locale })};
			case "medium": return {date: format(datetime, 'PPp', { locale }), distanceToNow: formatDistanceToNow(datetime, { addSuffix, locale: locale })};
			default: return {date: format(datetime, dateTimeFormat), distanceToNow: formatDistanceToNow(datetime, { addSuffix, locale: locale })};
		}
	} catch(e) {
		console.error(`Invalid date value: ${datetime}. `, e);
		return { date: 'Invalid Date' };
	}
}
