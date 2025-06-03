import originalTimeToString from "./timeToString.js";


export const newTimeToString = (value, dateTimeFormat = "medium", locale= undefined) => {
    const result = originalTimeToString(value, dateTimeFormat, locale);
    return result.date;
}

export default newTimeToString;