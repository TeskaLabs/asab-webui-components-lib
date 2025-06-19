import { getFormattedTimeRelative } from './getFormattedTimeRelative.jsx';
import { DEFAULT_DATE_FORMAT, DEFAULT_LOCALE } from '../utils/timeFormatDefaults.js'

// Simplifies original timeToStringRelative
export const timeToStringRelative = (value, dateTimeFormat = DEFAULT_DATE_FORMAT, addSuffix = false, locale = DEFAULT_LOCALE) => {
	const result = getFormattedTimeRelative(value, dateTimeFormat, addSuffix, locale);
	return result.date;
}
