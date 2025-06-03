import timeToString from "./timeToString.js";

// Simplifies original timeToString
export const newTimeToString = (value, dateTimeFormat = "medium", locale= undefined) => {
    const result = timeToString(value, dateTimeFormat, locale);
    return result.date;
}

export default newTimeToString;