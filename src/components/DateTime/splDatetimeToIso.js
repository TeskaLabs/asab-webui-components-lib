export function splDatetimeToIso(datetime) {
	let BigIntDatetime = BigInt(datetime); // Convert to BigInt for correct bitwise operations

	// Year extraction (bits 46-60)
	let year = Number((BigIntDatetime >> BigInt(46)) & BigInt(0b111111111111)); // 14 bits
	if (year >= 0b10_0000_0000_0000) {
		year -= 0b10_0000_0000_0000; // Adjust for sign bit if necessary
	}

	// Month extraction (bits 42-46)
	let month = Number((BigIntDatetime >> BigInt(42)) & BigInt(0b1111)); // 4 bits

	// Day extraction (bits 37-42)
	let day = Number((BigIntDatetime >> BigInt(37)) & BigInt(0b11111)); // 5 bits

	// Hour extraction (bits 32-37)
	let hour = Number((BigIntDatetime >> BigInt(32)) & BigInt(0b11111)); // 5 bits

	// Minute extraction (bits 26-32)
	let minute = Number((BigIntDatetime >> BigInt(26)) & BigInt(0b111111)); // 6 bits

	// Second extraction (bits 20-26)
	let second = Number((BigIntDatetime >> BigInt(20)) & BigInt(0b111111)); // 6 bits

	// Microsecond extraction (bits 0-20)
	let microsecond = Number(BigIntDatetime & BigInt(0b111111111111111111111)); // 20 bits

	// Adjust for zero-based month
	month += 1;

	// Format date string
	return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}.${microsecond.toString().padStart(6, '0')}Z`;
}
