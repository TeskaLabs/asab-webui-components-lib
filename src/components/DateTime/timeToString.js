import { format, parseISO, formatISO, formatDistanceToNow } from 'date-fns';

const timeToString = (value, dateTimeFormat = "medium", locale) => {

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
			date = formatDate(parseISO(value), dateTimeFormat, locale);
		}
	} else {
		if (value > 9999999999) {
			date = formatDate(value, dateTimeFormat);
		} else {
			date = formatDate(value * 1000, dateTimeFormat, locale);
		}
	}

	return { date: date.date, distanceToNow: date.distanceToNow };
};

const formatDate = (value, dateTimeFormat, locale) => {
	switch(dateTimeFormat) {
		case "long": return {date: format(value, 'PPpp', { locale }), distanceToNow: formatDistanceToNow(value, { addSuffix: true, locale: locale })};
		case "iso": return {date: formatISO(value), distanceToNow: formatDistanceToNow(value, { addSuffix: true, locale: locale })};
		case "medium": return {date: format(value, 'PPp', { locale }), distanceToNow: formatDistanceToNow(value, { addSuffix: true, locale: locale })};
		default: return {date: format(value, dateTimeFormat), distanceToNow: formatDistanceToNow(value, { addSuffix: true, locale: locale })};
	}
};

export default timeToString;
