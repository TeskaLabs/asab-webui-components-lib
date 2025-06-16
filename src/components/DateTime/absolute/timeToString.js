import getFormattedTime from './getFormattedTime.js';

// Simplifies original timeToString
export const timeToString = (value, dateTimeFormat = 'medium', locale= undefined) => {
	const result = getFormattedTime(value, dateTimeFormat, locale);
	return result.date;
}

export default timeToString;
