import { timeToStringRelativeWithMetadata } from "./timeToStringRelativeWithMetadata.jsx";

// Simplifies original timeToStringRelative (now timeToStringRelativeWithMetadata)
export const timeToStringRelative = (value, dateTimeFormat = "medium", addSuffix = false, locale = undefined) => {
    const result = timeToStringRelativeWithMetadata(value, dateTimeFormat, addSuffix, locale);
    return result.date
}