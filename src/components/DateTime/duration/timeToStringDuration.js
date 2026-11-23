import { getFormattedTimeDuration } from './getFormattedTimeDuration.js';

// Returns a duration (delta time in seconds) as a human readable string, e.g. "1h 10m 5s"
export const timeToStringDuration = (value) => {
	const result = getFormattedTimeDuration(value);
	return result.duration;
}

export default timeToStringDuration;
