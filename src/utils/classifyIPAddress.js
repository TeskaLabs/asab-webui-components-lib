function parseIPv4(ipAddress) {

	if (typeof ipAddress == 'string') {
		const ipv4Octets = ipAddress.split('.'); // Octet is on of the segments of an IP address
		if (ipv4Octets.length == 4) {
			return ipv4Octets.reduce((acc, octet) => (acc << 8n) + BigInt(octet), 0n);
		} else {
			return undefined;
		}
	}

	var bigintIP4Address = undefined;
	if (typeof ipAddress === 'bigint') {
		bigintIP4Address = ipAddress;
	}
	else if (typeof ipAddress === 'object' && ipAddress.h && ipAddress.l) {
		// This part can be removed in Jan 2026 when object form of IP address is removed from the codebase
		bigintIP4Address = (BigInt(ipAddress.h) << 64n) + BigInt(ipAddress.l);
	}
	else if (typeof ipAddress === 'number') {
		bigintIP4Address = BigInt(ipAddress);
	}

	if (bigintIP4Address !== undefined) {
		// Check if the address is in the ::ffff:0:0/96 range (IPv4-mapped IPv6 addresses) - then it is an IPv4 address
		const ipv4MappedPrefix = BigInt('0x0000000000000000FFFF00000000');
		const ipv4Mask = BigInt('0xFFFFFFFF');
		if ((bigintIP4Address & BigInt('0xFFFFFFFFFFFFFFFFFFFF00000000')) === ipv4MappedPrefix) {
			return bigintIP4Address & ipv4Mask
		}

		// Check if the address is in the ::/96 range - then it is an IPv4 address
		const ipv6Prefix = BigInt('0x00000000000000000000000000000000');
		if ((bigintIP4Address & BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFF00000000')) === ipv6Prefix) {
			return bigintIP4Address;
		}
	}

	return undefined;
}

function parseIPv6(ipAddress) {
	if (typeof ipAddress == 'string') {
		let ipv6Address = ipAddress;

		if (ipv6Address.includes('::')) {
			const parts = ipv6Address.split('::');
			const left = parts[0] ? parts[0].split(':') : [];
			const right = parts[1] ? parts[1].split(':') : [];
			const missing = 8 - (left.length + right.length);
			const zeros = Array(missing).fill('0000');
			const full = [...left, ...zeros, ...right];
			ipv6Address = full.map(block => block.padStart(4, '0')).join(':');
		}

		const ipv6Blocks = ipv6Address.split(':'); // Block is on of the segments of an IP address
		if (ipv6Blocks.length == 8) {
			return ipv6Blocks.reduce((acc, block) => (acc << 16n) + BigInt(parseInt(block, 16)), 0n);
		} else {
			return undefined;
		}
	}
	else if (typeof ipAddress === 'bigint') {
		return ipAddress;
	}
	else if (typeof ipAddress === 'object' && ipAddress.h && ipAddress.l) {
		// This part can be removed in Jan 2026 when object form of IP address is removed from the codebase
		return (BigInt(ipAddress.h) << 64n) + BigInt(ipAddress.l);
	}
	else if (typeof ipAddress === 'number') {
		return BigInt(ipAddress);
	}

	return undefined;
}

// Request for Comments: 6890
// Special-Purpose IP Address Registries
// https://datatracker.ietf.org/doc/html/rfc6890

const ipv4Ranges = [
	{
		block: parseIPv4("10.0.0.0"),
		mask: 8,
		attrs: {
			cls: "private",
			family: "IPv4",
			msg: "IPv4 private"
		}
	},
	{
		block: parseIPv4("172.16.0.0"),
		mask: 12,
		// https://datatracker.ietf.org/doc/html/rfc1918
		attrs: {
			cls: "private",
			family: "IPv4",
			msg: "IPv4 private"
		}
	},
	{
		block: parseIPv4("192.168.0.0"),
		mask: 16,
		attrs: {
			cls: "private",
			family: "IPv4",
			msg: "IPv4 private"
		}
	},
	{
		block: parseIPv4("169.254.0.0"),
		mask: 24,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 reserved"
		}
	},
	{
		block: parseIPv4("169.254.255.0"),
		mask: 24,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 reserved"
		}
	},
	{
		block: parseIPv4("169.254.0.0"),
		mask: 16,
		// https://datatracker.ietf.org/doc/html/rfc3927
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 link-local"
		}
	},
	{
		block: parseIPv4("100.64.0.0"),
		mask: 10,
		// Shared Address Space https://datatracker.ietf.org/doc/html/rfc6598
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 Shared Address Space"
		}
	},
	{
		block: parseIPv4("127.0.0.0"),
		mask: 8,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 loopback"
		}
	},
	{
		block: parseIPv4("0.0.0.0"),
		mask: 8,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 reserved"
		}
	},
	{
		block: parseIPv4("192.0.0.0"),
		mask: 29,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 ds-lite"
		}
	},
	{
		block: parseIPv4("192.0.2.0"),
		mask: 24,
		// https://datatracker.ietf.org/doc/html/rfc5737
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 documentation"
		}
	},
	{
		block: parseIPv4("192.88.99.0"),
		mask: 24,
		// RFC3068
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 6to4"
		}
	},
	{
		block: parseIPv4("198.18.0.0"),
		mask: 15,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 benchmarking"
		}
	},
	{
		block: parseIPv4("198.51.100.0"),
		mask: 24,
		// https://datatracker.ietf.org/doc/html/rfc5737
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 documentation"
		}
	},
	{
		block: parseIPv4("203.0.113.0"),
		mask: 24,
		// https://datatracker.ietf.org/doc/html/rfc5737
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 documentation"
		}
	},
	{
		block: parseIPv4("240.0.0.0"),
		mask: 4,
		// [RFC1112], Section 4
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 reserved"
		}
	},
	{
		block: parseIPv4("255.255.255.255"),
		mask: 32,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "IPv4 limited-broadcast"
		}
	}	
]

const ipv6Ranges = [
	{
		block: parseIPv6("::1"),
		mask: 128,
		// https://datatracker.ietf.org/doc/html/rfc4291
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv6 loopback"
		}
	},
	{
		block: parseIPv6("::"),
		mask: 128,
		// https://datatracker.ietf.org/doc/html/rfc4291
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv6 unspecified"
		}
	},
	{
		block: parseIPv6("64:ff9b::"),
		mask: 96,
		// https://datatracker.ietf.org/doc/html/rfc6052
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv6 IPv4-IPv6"
		}
	},
	{
		block: parseIPv6("::ffff:0:0"),
		mask: 96,
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv6 IPv4-mapped"
		}
	},
	{
		block: parseIPv6("100::"),
		mask: 64,
		// https://datatracker.ietf.org/doc/html/rfc6666
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv6 discard"
		}
	},
	{
		block: parseIPv6("2001::"),
		mask: 32,
		// https://datatracker.ietf.org/doc/html/rfc4380
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv6 terredo"
		}
	},
	{
		block: parseIPv6("2001:2::"),
		mask: 32,
		// https://datatracker.ietf.org/doc/html/rfc5180
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv6 benchmarking"
		}
	},
	{
		block: parseIPv6("2001:db8::"),
		mask: 32,
		// https://datatracker.ietf.org/doc/html/rfc3849
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv6 documentation"
		}
	},
	{
		block: parseIPv6("2001:10::"),
		mask: 28,
		// https://datatracker.ietf.org/doc/html/rfc4843
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv6 orchid"
		}
	},
	{
		block: parseIPv6("2002::"),
		mask: 16,
		// https://datatracker.ietf.org/doc/html/rfc3056
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv6 6to4"
		}
	},
	{
		block: parseIPv6("fc00::"),
		mask: 7,
		// https://datatracker.ietf.org/doc/html/rfc4193
		attrs: {
			cls: "private",
			family: "IPv6",
			msg: "IPv6 unique local"
		}
	},
	{
		block: parseIPv6("fe80::"),
		mask: 10,
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv6 link-local"
		}
	}
]


function classifyIPv4(ipAddress) {
	for (const range of ipv4Ranges) {
		const mask = BigInt(2) ** BigInt(32 - range.mask) - BigInt(1);
		const network = range.block & ~mask;
		const ipNetwork = ipAddress & ~mask;
		
		if (network === ipNetwork) {
			return {...range.attrs, normalizedValue: stringifyIPv4(ipAddress)};
		}
	}

	return {
		cls: "public",
		family: "IPv4",
		normalizedValue: stringifyIPv4(ipAddress),
		msg: "IPv4 public"
	}
}

function classifyIPv6(ipAddress) {
	for (const range of ipv6Ranges) {
		const mask = BigInt(2) ** BigInt(128 - range.mask) - BigInt(1);
		const network = range.block & ~mask;
		const ipNetwork = ipAddress & ~mask;
		
		if (network === ipNetwork) {
			return {...range.attrs, normalizedValue: stringifyIPv6(ipAddress)};
		}
	}

	return {
		cls: "public",
		family: "IPv6",
		normalizedValue: stringifyIPv6(ipAddress),
		msg: "IPv6 public"
	}
}


/*
	Classify an IP address.
	Input:
		ipAddress - string/BigInt/object{h: number, l: number}, IP address to classify
	
	Returns:
		Dictionary
*/

export function classifyIPAddress(ipAddress) {
	let ipv4 = undefined;
	let ipv6 = undefined;

	if (ipAddress == undefined) {
		return {
			cls: "invalid",
			normalizedValue: "N/A",
			msg:"Not an IP address",
		};
	}

	// Parse IPv4 address
	try {
		ipv4 = parseIPv4(ipAddress);
	} catch (error) {
		console.error(error);
		return {
			cls: "invalid",
			normalizedValue: sanitizeInvalidIPAddress(ipAddress),
			msg:"invalid parse ipv4",
		};
	}
	if (ipv4 !== undefined) {
		return classifyIPv4(ipv4);
	}

	// Parse IPv6 address
	try {
		ipv6 = parseIPv6(ipAddress);
	} catch (error) {
		return {
			cls: "invalid",
			normalizedValue: sanitizeInvalidIPAddress(ipAddress),
			msg:"invalid parse ipv6",
		};
	}
	if (ipv6 !== undefined) {
		return classifyIPv6(ipv6);
	}

	return {
		cls: "invalid",
		normalizedValue: sanitizeInvalidIPAddress(ipAddress),
		msg: "Not an IP address",
	};
}


// Improved function to compress IPv6 addresses, fully replicating Python's `.compressed` behavior.
const stringifyIPv6 = (bigintIP6Address) => {
	const parts = [];
	for (let i = 0; i < 8; i++) {
		parts.unshift(Number(bigintIP6Address & 0xFFFFn).toString(16));
		bigintIP6Address >>= 16n;
	}

	// Variables to track the start and length of the longest sequence of zeros.
	let zeroStart = -1; // Start index of the longest zero sequence
	let zeroMax = 0; // Length of the longest zero sequence
	let zeroTempStart = -1; // Start index of the current zero sequence being checked
	let zeroTempLen = 0; // Length of the current zero sequence being checked

	// Iterate through the parts of the IPv6 address to find the longest sequence of zeros.
	for (let i = 0; i < parts.length; i++) {
		if (parts[i] === '0') {
			// If the current part is zero, start or continue tracking a zero sequence.
			if (zeroTempStart === -1) zeroTempStart = i; // Mark the start of the sequence
			zeroTempLen++; // Increment the length of the current sequence
		} else {
			// If the current part is not zero, check if the current zero sequence is the longest.
			if (zeroTempLen > zeroMax) {
				zeroStart = zeroTempStart; // Update the start of the longest sequence
				zeroMax = zeroTempLen; // Update the length of the longest sequence
			}
			// Reset the tracking variables for the next potential zero sequence.
			zeroTempStart = -1;
			zeroTempLen = 0;
		}
	}

	// After the loop, check if the last zero sequence is the longest.
	if (zeroTempLen > zeroMax) {
		zeroStart = zeroTempStart;
		zeroMax = zeroTempLen;
	}

	// If a sequence of more than one zero is found, replace it with `::` to compress the IPv6 address.
	if (zeroMax > 1) {
		parts.splice(zeroStart, zeroMax, ''); // Replace the zero sequence with an empty string
	}

	// Join the parts with colons to form the final compressed IPv6 address.
	return parts.join(':');
};

const stringifyIPv4 = (bigintIP4Address) => {
	const parts = [];
	for (let i = 0; i < 4; i++) {
		parts.push(Number(bigintIP4Address & 0xFFn));
		bigintIP4Address >>= 8n;
	}
	return parts.reverse().join('.');
};

// This function is used to sanitize the input which is NOT the IP address to a string.
const sanitizeInvalidIPAddress = (ipAddress) => {
	if (typeof ipAddress === 'string') {
		return ipAddress;
	}
	else if (typeof ipAddress === 'bigint') {
		return ipAddress.toString();
	}
	else if (typeof ipAddress === 'object') {
		return `${ipAddress}`;  // TODO: This can be more clever if needed
	}
	else if (typeof ipAddress === 'number') {
		return ipAddress.toString();
	} else {
		return "???";
	}
}
