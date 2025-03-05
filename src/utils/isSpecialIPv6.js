import { ipCategories } from './lookups/ipCategories';

/*
	JavaScript does not natively handle 128-bit integers,
	which are needed to represent IPv6 addresses fully.
	Instead, operations on IPv6 addresses typically involve converting them
	into a binary format or a numeric representation (e.g., using BigInt)
*/

// Convert an IP address (IPv4 or IPv6) to BigInt representation
function ipv6ToBigInt(ip) {
	// Determine the IP version: IPv4 (.) or IPv6 (:)
	const version = ip.includes(':') ? 6 : ip.includes('.') ? 4 : 0;
	if (!version) return null;

	let number = 0n; // Initialize BigInt to store numeric IP represenation
	let exp = 0n; // Keep track of bit shifts per segment

	if (version === 4) {
		// Convert IPv4 to BigInt - each octet is 8 bits, so will be shifted accordingly
		for (const n of ip.split('.').map(BigInt).reverse()) {
			number += n * (2n ** exp); // Shift the current segment into its correct position and add it to the total IP value
			exp += 8n; // Increase the exponent by 8 for each segment
		}
	} else {
		// Handle IPv4-mapped IPv6 addresses (::ffff:192.168.1.1)
		if (ip.includes('.')) {
			ip = ip.split(':').map(part => {
				if (part.includes('.')) {
					// Convert the last part (IPv4 address) into hexadecimal format
					const [a, b, c, d] = part.split('.').map(str =>
						Number(str).toString(16).padStart(2, '0')
					);
					return `${a}${b}:${c}${d}`; // Format as an IPv6 segment
				}
				return part; // Keep other parts unchanged
			}).join(':'); // Reconstruct the IPv6 address
		}

		// Expand IPv6 shorthand notation (::) by inserting missing '0' blocks
		const parts = ip.split(':'); // Split IPv6 address into segments
		const index = parts.indexOf(''); // Find the '::' shorthand

		if (index !== -1) {
			// Fill missing segments with zeros to ensure there are 8 parts
			while (parts.length < 8) parts.splice(index, 0, '');
		}

		// Convert IPv6 segments to BigInt
		for (const n of parts.map(part => BigInt(parseInt(part || '0', 16))).reverse()) {
			number += n * (2n ** exp); // Shift each segment accordingly
			exp += 16n; // Each IPv6 segment is 16 bits
		}
	}

	return number; // Return the BigInt representation of the IP address
}

// Convert a CIDR block (e.g. 2001:db8::/32) into a numerical range
function calculateRangeBigInt(cidr) {
	const [baseIp, prefixLength] = cidr.split('/'); // Extract base IP and subnet prefix
	const baseBigInt = ipv6ToBigInt(baseIp); // Convert base IP to BigInt
	const maskBits = BigInt(128 - parseInt(prefixLength)); // Calculate the number of host bits

	// Calculate the first address in the range
	const firstAddress = baseBigInt & (~BigInt(0) << maskBits);

	// Calculate the last address in the range
	const lastAddress = baseBigInt | ((BigInt(1) << maskBits) - BigInt(1));

	return { firstAddress, lastAddress }; // Return the range of addresses
}

// Check if an IP (as BigInt) falls within a CIDR range
function isWithinRange(ipBigInt, cidr) {
	const { firstAddress, lastAddress } = calculateRangeBigInt(cidr); // Get first and last addresses

	return ipBigInt >= firstAddress && ipBigInt <= lastAddress;
}

// Convert an IP to BigInt and categorize it
export function isSpecialIPv6(ip) {
	const ipBigInt = ipv6ToBigInt(ip);

	for (const category of ipCategories) {
		if (isWithinRange(ipBigInt, category.cidr)) {
			return category.usage;
		}
	}

	return null; // Return null if no category matches
}
