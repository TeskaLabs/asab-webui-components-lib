// For best performance, create a regular expression only once.
const n_digits = /^\d+n$/;

export function validateDateTime(value) {
	// Return 'Invalid Date' if the input is null or undefined
	if (value == null) {
		return 'Invalid Date';
	}

	// Handle BigInt values explicitly
	if (typeof value === 'bigint') {
		// SP-Lang datetime format is represented as BigInt
		return splDatetimeToIso(value);
	}

	// Handle string values
	if (typeof value === 'string') {
		// Check if string ends with 'n' AND verify the entire string consists only of digits followed by 'n'
		if (value.endsWith('n') && n_digits.test(value)) {
			try {
				// Remove the 'n' suffix before converting to BigInt
				return splDatetimeToIso(BigInt(value.slice(0, -1)));
			} catch {
				return 'Invalid Date';
			}
		}
		return new Date(value);
	}

	// Handle number values
	if (typeof value === 'number') {
		// Reject infinite, NaN, or negative numbers
		if (!Number.isFinite(value)) {
			return 'Invalid Date';
		}
		console.log(value, '0')

		// Handle Unix timestamp in seconds (less than 1e11)
		if (Math.abs(value) < 1e11) {
			return new Date(value * 1000); // Convert seconds to milliseconds
		}

		// Handle timestamps in milliseconds (less than 1e14)
		if (Math.abs(value) < 1e14) {
			return new Date(value); // Already in milliseconds
		}

		// Handle timestamps in microseconds (less than 1e17)
		if (Math.abs(value) < 1e17) {
			return new Date(value / 1000); // Convert microseconds to milliseconds
		}
	}

	// All other types are unsupported and result in 'Invalid Date'
	return 'Invalid Date';
}

function splDatetimeToIso(datetime) {
	// Check if datetime is a number or BigInt
	if ((typeof datetime !== 'bigint') && (typeof datetime !== 'number')) {
		return 'Invalid Date';
	}
	// Year extraction (bits 46-60)
	let year = Number((datetime >> BigInt(46)) & BigInt(0b111111111111)); // 14 bits
	if (year >= 0b10_0000_0000_0000) {
		year -= 0b10_0000_0000_0000; // Adjust for sign bit if necessary
	}

	// Month extraction (bits 42-45)
	const month = Number((datetime >> BigInt(42)) & BigInt(0b1111)); // 4 bits

	// Day extraction (bits 37-41)
	const day = Number((datetime >> BigInt(37)) & BigInt(0b11111)); // 5 bits

	// Hour extraction (bits 32-36)
	const hour = Number((datetime >> BigInt(32)) & BigInt(0b11111)); // 5 bits

	// Minute extraction (bits 26-31)
	const minute = Number((datetime >> BigInt(26)) & BigInt(0b111111)); // 6 bits

	// Second extraction (bits 20-25)
	const second = Number((datetime >> BigInt(20)) & BigInt(0b111111)); // 6 bits

	// Microsecond extraction (bits 0-19)
	const microsecond = Number(datetime & BigInt(0b11111111111111111111)); // 20 bits

	// Check if the values are correct
	if (
		year < 0 || month < 1 || month > 12 ||
		day < 1 || day > 31 || hour > 23 ||
		minute > 59 || second > 59 || microsecond > 999999
	) {
		return 'Invalid Date';
	}

	// Format date string
	return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}.${microsecond.toString().padStart(6, '0')}Z`;
}
