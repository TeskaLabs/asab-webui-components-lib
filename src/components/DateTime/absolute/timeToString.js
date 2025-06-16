import getFormattedTime from './getFormattedTime.js';
import { DEFAULT_DATE_FORMAT, DEFAULT_LOCALE } from '../utils/timeFormatDefaults.js'

// Simplifies original timeToString
export const timeToString = (value, dateTimeFormat = DEFAULT_DATE_FORMAT, locale= DEFAULT_LOCALE) => {
	const result = getFormattedTime(value, dateTimeFormat, locale);
	return result.date;
}

export default timeToString;
