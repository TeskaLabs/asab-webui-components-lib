import { getFormattedTimeRelative } from "./getFormattedTimeRelative.jsx";

// Simplifies original timeToStringRelative
export const timeToStringRelative = (value, dateTimeFormat = "medium", addSuffix = false, locale = undefined) => {
	const result = getFormattedTimeRelative(value, dateTimeFormat, addSuffix, locale);
	return result.date
}
