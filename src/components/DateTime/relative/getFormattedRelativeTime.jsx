import { timeToStringCommon } from '../utils/timeToStringCommon.jsx';

// Relative time formatting without "ago"
export const getFormattedRelativeTime = (value, dateTimeFormat = "medium", addSuffix = false, locale = undefined) => {
	// TODO: add addSuffix = true for values which are to the future from now (we can use of isAfter from date-fns)
	const { date, distanceToNow } = timeToStringCommon(value, dateTimeFormat, locale, addSuffix);
	if (date === 'Invalid Date') {
		return { date };
	}
	return { date: distanceToNow, absoluteTime: date };
}
