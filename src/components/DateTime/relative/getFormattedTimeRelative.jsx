import { timeToStringCommon } from '../utils/timeToStringCommon.jsx';
import { DEFAULT_DATE_FORMAT, DEFAULT_LOCALE } from '../utils/timeFormatDefaults.js'

// Relative time formatting without 'ago'
export const getFormattedTimeRelative = (value, dateTimeFormat = DEFAULT_DATE_FORMAT, addSuffix = false, locale = DEFAULT_LOCALE) => {
	// TODO: add addSuffix = true for values which are to the future from now (we can use of isAfter from date-fns)
	const { date, distanceToNow } = timeToStringCommon(value, dateTimeFormat, locale, addSuffix);
	if (date === 'Invalid Date') {
		return { date };
	}
	return { date: distanceToNow, absoluteTime: date };
}
