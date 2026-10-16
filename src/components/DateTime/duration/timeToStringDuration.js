import { getFormattedTimeDuration } from './getFormattedTimeDuration.js';

// Returns a duration (delta time in seconds) as a human readable string, e.g. "1 h 10 m 5 s"
export const timeToStringDuration = (value) => {
	const result = getFormattedTimeDuration(value);
	return result.duration;
}

export default timeToStringDuration;
