import { timeToStringCommon } from '../utils/timeToStringCommon.jsx';

// Relative time formatting without "ago"
export const timeToStringRelative = (value, dateTimeFormat = "medium", locale = undefined) => {
	// TODO: add addSuffix = true for values which are to the future from now (we can use of isAfter from date-fns)
	return timeToStringCommon(value, dateTimeFormat, locale, false); // addSuffix = false
}
