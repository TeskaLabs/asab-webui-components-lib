/*
	Formats a duration (delta time in seconds) into a human readable form,
	e.g. "1 h 10 m 5 s".
*/
export const getFormattedTimeDuration = (value) => {
	if ((typeof value !== 'number') || isNaN(value)) {
		return { duration: 'Invalid value', value };
	}

	const sign = value < 0 ? '-' : '';
	let remainder = Math.abs(value);

	const days = Math.floor(remainder / 86400);
	remainder -= days * 86400;
	const hours = Math.floor(remainder / 3600);
	remainder -= hours * 3600;
	const minutes = Math.floor(remainder / 60);
	const seconds = remainder - minutes * 60;

	// Collect non-zero units, keeping the order from the largest to the smallest
	const parts = [];
	if (days > 0) {
		parts.push(`${days} d`);
	}
	if (hours > 0) {
		parts.push(`${hours} h`);
	}
	if (minutes > 0) {
		parts.push(`${minutes} m`);
	}
	// Seconds are shown also on zero, so that e.g. 0 is displayed as "0 s"
	if ((seconds > 0) || (parts.length === 0)) {
		parts.push(`${formatSeconds(seconds)} s`);
	}

	return { duration: `${sign}${parts.join(' ')}`, value };
}

// Display seconds with a fraction only when needed (e.g. 1.5 -> "1.5", 2 -> "2")
function formatSeconds(seconds) {
	return Number.isInteger(seconds) ? seconds : parseFloat(seconds.toFixed(2));
}
