import { getFormattedRelativeTime } from "./getFormattedRelativeTime.jsx";

// Simplifies original timeToStringRelative (now getFormattedRelativeTime)
export const timeToStringRelative = (value, dateTimeFormat = "medium", addSuffix = false, locale = undefined) => {
	const result = getFormattedRelativeTime(value, dateTimeFormat, addSuffix, locale);
	return result.date
}
