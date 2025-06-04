// import timeToS from "./timeToString.js";
import timeToStringWithMetadata from "./timeToStringWithMetadata.js";

// Simplifies original timeToString (now timeToStringWithMetadata)
export const timeToString = (value, dateTimeFormat = "medium", locale= undefined) => {
    const result = timeToStringWithMetadata(value, dateTimeFormat, locale);
    return result.date;
}

export default timeToString;