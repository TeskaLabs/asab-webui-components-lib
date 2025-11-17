import { format, parseISO, formatISO, formatDistanceToNow, isValid } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { validateDateTime } from './validateDateTime.jsx';

const SHORTENED_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const FULL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export const timeToStringCommon = (value, dateTimeFormat, locale = enUS, addSuffix = true) => {
	const invalidDate = { date: 'Invalid Date' };
	if (value == null) return invalidDate;

	const datetime = validateDateTime(value);
	if (datetime === 'Invalid Date' || !isValid(datetime)) return invalidDate;

	// Ancient dates are processed separately
	if (datetime.getFullYear() < 1000) {
		return formatAncientDate(datetime, dateTimeFormat, addSuffix, locale);
	}

	// Regular dates via date-fns
	let distanceToNow;
	try {
		distanceToNow = formatDistanceToNow(datetime, { addSuffix, locale });
	} catch {
		distanceToNow = addSuffix ? 'a long time ago' : 'a long time';
	}

	let date;
	try {
		switch (dateTimeFormat) {
			case 'long': date = format(datetime, 'PPpp', { locale }); break;
			case 'medium': date = format(datetime, 'PPp', { locale }); break;
			case 'iso': date = formatISO(datetime); break;
			default: date = format(datetime, dateTimeFormat, { locale }); break;
		}
	} catch {
		date = datetime.toISOString();
	}

	return { date, distanceToNow };
};

// Formatting ancient dates based on locale
const formatAncientDate = (datetime, dateTimeFormat, addSuffix, locale = enUS) => {
	const pad = (num, size = 2) => String(num).padStart(size, '0');
	const year = String(datetime.getUTCFullYear()).padStart(4, '0');
	const month = datetime.getUTCMonth();
	const day = pad(datetime.getUTCDate());
	const hour = pad(datetime.getUTCHours());
	const minute = pad(datetime.getUTCMinutes());
	const second = pad(datetime.getUTCSeconds());

	let distanceToNow;
	try {
		distanceToNow = formatDistanceToNow(datetime, { addSuffix, locale });
	} catch {
		distanceToNow = addSuffix ? 'a long time ago' : 'a long time';
	}

	// Используем locale для названий месяцев
	const monthNames = locale.localize?.month
		? Array.from({ length: 12 }, (_, i) => locale.localize.month(i, { width: 'abbreviated' }))
		: SHORTENED_MONTHS;
	const fullMonthNames = locale.localize?.month
		? Array.from({ length: 12 }, (_, i) => locale.localize.month(i, { width: 'wide' }))
		: FULL_MONTHS;

	let formattedDate;
	switch (dateTimeFormat) {
		case 'long':
			formattedDate = `${fullMonthNames[month]} ${parseInt(day)}, ${year} ${hour}:${minute}:${second}`;
			break;
		case 'medium':
			formattedDate = `${monthNames[month]} ${parseInt(day)}, ${year} ${hour}:${minute}:${second}`;
			break;
		case 'iso':
			formattedDate = `${year}-${pad(month + 1)}-${day}T${hour}:${minute}:${second}Z`;
			break;
		default:
			formattedDate = `${year}-${pad(month + 1)}-${day} ${hour}:${minute}:${second}`;
			break;
	}

	return { date: formattedDate, distanceToNow };
};
