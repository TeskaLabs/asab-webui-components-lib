import { format, parseISO, formatISO, formatDistanceToNow } from 'date-fns';

// Common logic for both timeToString and timeToStringRelative
export const timeToStringCommon = (value, dateTimeFormat, locale, addSuffix) => {
	if (value == undefined) {
		return 'Invalid Date';
	}

	if (new Date(value).toString() === "Invalid Date") {
		return 'Invalid Date';
	}

	// TODO: uncomment to eventually add more defensiveness on dateTimeFormat
	// try {
	// 	format(value, dateTimeFormat);
	// } catch(e) {
	// 	console.error(`ASAB WebUI Components: DateTime - Invalid date time format ${dateTimeFormat}. The format is set to its default.`);
	// 	dateTimeFormat = "medium";
	// }

	let date;

	if (isNaN(value) == true) {
		// Checking dates for parsing
		if (parseISO(value) == "Invalid Date") {
			return 'Invalid Date';
		} else {
			date = formatDate(parseISO(value), dateTimeFormat, locale, addSuffix);
		}
	} else {
		if (value > 9999999999) {
			date = formatDate(value, dateTimeFormat, locale, addSuffix);
		} else {
			date = formatDate(value * 1000, dateTimeFormat, locale, addSuffix);
		}
	}

	return {date: date.date, distanceToNow: date.distanceToNow};
}

const formatDate = (value, dateTimeFormat, locale, addSuffix) => {

	switch(dateTimeFormat) {
		case "long": return {date: format(value, 'PPpp', { locale }), distanceToNow: formatDistanceToNow(value, { addSuffix, locale: locale })};
		case "iso": return {date: formatISO(value), distanceToNow: formatDistanceToNow(value, { addSuffix, locale: locale })};
		case "medium": return {date: format(value, 'PPp', { locale }), distanceToNow: formatDistanceToNow(value, { addSuffix, locale: locale })};
		default: return {date: format(value, dateTimeFormat), distanceToNow: formatDistanceToNow(value, { addSuffix, locale: locale })};
	}
}
