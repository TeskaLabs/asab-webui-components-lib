import { timeToStringRelative } from "./timeToStringRelative.jsx";

export const newTimeToStringRelative = (value, dateTimeFormat = "medium", addSuffix = false, locale = undefined) => {
    const result = timeToStringRelative(value, dateTimeFormat, addSuffix, locale);
    return result.date
}