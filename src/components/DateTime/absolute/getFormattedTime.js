import { timeToStringCommon } from '../utils/timeToStringCommon.jsx';
import { DEFAULT_DATE_FORMAT, DEFAULT_LOCALE } from '../utils/timeFormatDefaults.js'

// Absolute time formatting with 'ago'
export const getFormattedTime = (value, dateTimeFormat = DEFAULT_DATE_FORMAT, locale = DEFAULT_LOCALE) => {
	const { date, distanceToNow } = timeToStringCommon(value, dateTimeFormat, locale, true); // addSuffix = true
	if (date === 'Invalid Date') {
		return { date };
	}
	return { date, distanceToNow };
}

export default getFormattedTime;
