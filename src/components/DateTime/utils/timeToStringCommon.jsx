import { format, parseISO, formatISO, formatDistanceToNow, isValid } from 'date-fns';
import { validateDateTime } from './validateDateTime.jsx';

// Common logic for both timeToString and timeToStringRelative
export const timeToStringCommon = (value, dateTimeFormat, locale, addSuffix) => {
	const invalidDate = { date: 'Invalid Date' };
	if (value == undefined) {
		return invalidDate;
	}

	let datetime;

	try {
		// Use validateDateTime to convert the input value
		datetime = validateDateTime(value);

		if (datetime.toString() === 'Invalid Date' || new Date(datetime).toString() === "Invalid Date") {
			return invalidDate;
		}

		// Checking the validity of the date
		if (!isValid(datetime)) {
			return invalidDate;
		}

		// Formatting the date via the improved formatDate function
		return formatDate(datetime, dateTimeFormat, locale, addSuffix);

	} catch (error) {
		console.error(`Error processing date value: ${value}`, error);
		return invalidDate;
	}
}

const formatDate = (datetime, dateTimeFormat, locale, addSuffix) => {
	try {
		let formattedDate;
		let distanceToNow;

		// Processing formatDistanceToNow with protection from ancient dates
		try {
			distanceToNow = formatDistanceToNow(datetime, { addSuffix, locale });
		} catch (error) {
			// For ancient dates that formatDistanceToNow does not support
			distanceToNow = addSuffix ? 'a long time ago' : 'a long time';
		}

		// Formatting the main date with protection from ancient dates
		try {
			switch(dateTimeFormat) {
				case "long":
					formattedDate = format(datetime, 'PPpp', { locale });
					break;
				case "iso":
					formattedDate = formatISO(datetime);
					break;
				case "medium":
					formattedDate = format(datetime, 'PPp', { locale });
					break;
				default:
					formattedDate = format(datetime, dateTimeFormat, { locale });
					break;
			}
		} catch (formatError) {
			// If date-fns cannot format an ancient date, we use manual formatting
			console.warn(`date-fns cannot format ancient date, using manual formatting: ${datetime}`);
			formattedDate = manualFormatDate(datetime, dateTimeFormat);
		}

		return {
			date: formattedDate,
			distanceToNow
		};

	} catch(error) {
		console.error(`Invalid date value: ${datetime}. `, error);
		return { date: 'Invalid Date' };
	}
}

// Manual formatting for ancient dates that date-fns does not support
const manualFormatDate = (datetime, dateTimeFormat) => {
	// Get the date components from the ISO string or create the correct year
	const isoString = datetime.toISOString ? datetime.toISOString() : datetime.toString();

	// Parse the ISO string to get the correct year for ancient dates
	let year, month, day, hours, minutes, seconds;

	if (isoString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
		// ISO format
		[year, month, day] = isoString.slice(0, 10).split('-');
		[hours, minutes, seconds] = isoString.slice(11, 19).split(':');
	} else {
		// Fallback to Date methods (may be inaccurate for ancient dates)
		year = String(datetime.getFullYear()).padStart(4, '0');
		month = String(datetime.getMonth() + 1).padStart(2, '0');
		day = String(datetime.getDate()).padStart(2, '0');
		hours = String(datetime.getHours()).padStart(2, '0');
		minutes = String(datetime.getMinutes()).padStart(2, '0');
		seconds = String(datetime.getSeconds()).padStart(2, '0');
	}

	// Use the Date methods for the time zone
	const timezoneOffset = -datetime.getTimezoneOffset();
	const timezoneHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
	const timezoneMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
	const timezoneSign = timezoneOffset >= 0 ? '+' : '-';

	switch(dateTimeFormat) {
		case "long":
			// Format: January 1, 0001 at 12:00:00 AM GMT+0
			const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
				'July', 'August', 'September', 'October', 'November', 'December'];
			const monthName = monthNames[parseInt(month) - 1];
			const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
			const twelveHour = parseInt(hours) % 12 || 12;
			return `${monthName} ${parseInt(day)}, ${year} at ${twelveHour}:${minutes}:${seconds} ${ampm} GMT${timezoneSign}${timezoneHours}:${timezoneMinutes}`;

		case "medium":
			// Format: Jan 1, 0001, 12:00:00 AM
			const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
				'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			const shortMonthName = shortMonthNames[parseInt(month) - 1];
			const ampmMedium = parseInt(hours) >= 12 ? 'PM' : 'AM';
			const twelveHourMedium = parseInt(hours) % 12 || 12;
			return `${shortMonthName} ${parseInt(day)}, ${year}, ${twelveHourMedium}:${minutes}:${seconds} ${ampmMedium}`;

		case "iso":
			// ISO Format: 0001-01-01T00:00:00Z
			return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

		default:
			// For custom formats, we are trying to use a simple replacement
			try {
				return dateTimeFormat
					.replace('yyyy', year)
					.replace('yy', String(year).slice(-2))
					.replace('MM', month)
					.replace('dd', day)
					.replace('HH', hours)
					.replace('mm', minutes)
					.replace('ss', seconds);
			} catch {
				// Fallback to a simple ISO-like format
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			}
	}
}