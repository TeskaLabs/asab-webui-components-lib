import { timeToStringCommon } from '../utils/timeToStringCommon.jsx';

// Absolute time formatting with "ago"
export const timeToString = (value, dateTimeFormat = "medium", locale = undefined) => {
	return timeToStringCommon(value, dateTimeFormat, locale, true); // addSuffix = true
}

export default timeToString;
