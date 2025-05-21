import { timeToStringCommon } from '../utils/timeToStringCommon.jsx';

// Absolute time formatting with "ago"
export const timeToString = (value, dateTimeFormat = "medium", locale = undefined) => {
	const { date, distanceToNow } = timeToStringCommon(value, dateTimeFormat, locale, true); // addSuffix = true
	if (date === 'Invalid Date') {
		return 'Invalid Date';
	}
	return { date, distanceToNow };
}

export default timeToString;
