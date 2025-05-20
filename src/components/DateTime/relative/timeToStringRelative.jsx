import { timeToStringCommon } from '../utils/timeToStringCommon.jsx';

// Relative time formatting without "ago"
export const timeToStringRelative = (value, dateTimeFormat = "medium", locale = undefined) => {
	return timeToStringCommon(value, dateTimeFormat, locale, false); // addSuffix = false
}
