function parseIPv4(ipAddress) {
	const ipv4Octets = ipAddress.split('.'); // Octet is on of the segments of an IP address
	if (ipv4Octets.length == 4) {
		return ipv4Octets.reduce((acc, octet) => (acc << 8n) + BigInt(octet), 0n);
	}

	return undefined;
}

function parseIPv6(ipAddress) {
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
		}
	},
	{
		block: parseIPv4("172.16.0.0"),
		mask: 12,
		// https://datatracker.ietf.org/doc/html/rfc1918
		attrs: {
			cls: "private",
			family: "IPv4",
		}
	},
	{
		block: parseIPv4("192.168.0.0"),
		mask: 16,
		attrs: {
			cls: "private",
			family: "IPv4",
		}
	},
	{
		block: parseIPv4("169.254.0.0"),
		mask: 24,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "reserved"
		}
	},
	{
		block: parseIPv4("169.254.255.0"),
		mask: 24,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "reserved"
		}
	},
	{
		block: parseIPv4("169.254.0.0"),
		mask: 16,
		// https://datatracker.ietf.org/doc/html/rfc3927
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "link-local"
		}
	},
	{
		block: parseIPv4("100.64.0.0"),
		mask: 10,
		// Shared Address Space https://datatracker.ietf.org/doc/html/rfc6598
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "Shared Address Space"
		}
	},
	{
		block: parseIPv4("127.0.0.0"),
		mask: 8,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "loopback"
		}
	},
	{
		block: parseIPv4("0.0.0.0"),
		mask: 8,
		attrs: {
			cls: "special",
			family: "IPv4",
		}
	},
	{
		block: parseIPv4("192.0.0.0"),
		mask: 29,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "ds-lite"
		}
	},
	{
		block: parseIPv4("192.0.2.0"),
		mask: 24,
		// https://datatracker.ietf.org/doc/html/rfc5737
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "documentation"
		}
	},
	{
		block: parseIPv4("192.88.99.0"),
		mask: 24,
		// RFC3068
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "6to4"
		}
	},
	{
		block: parseIPv4("198.18.0.0"),
		mask: 15,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "benchmarking"
		}
	},
	{
		block: parseIPv4("198.51.100.0"),
		mask: 24,
		// https://datatracker.ietf.org/doc/html/rfc5737
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "documentation"
		}
	},
	{
		block: parseIPv4("203.0.113.0"),
		mask: 24,
		// https://datatracker.ietf.org/doc/html/rfc5737
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "documentation"
		}
	},
	{
		block: parseIPv4("240.0.0.0"),
		mask: 4,
		// [RFC1112], Section 4
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "reserved"
		}
	},
	{
		block: parseIPv4("255.255.255.255"),
		mask: 32,
		attrs: {
			cls: "special",
			family: "IPv4",
			msg: "limited-broadcast"
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
			msg: "loopback"
		}
	},
	{
		block: parseIPv6("::"),
		mask: 128,
		// https://datatracker.ietf.org/doc/html/rfc4291
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "unspecified"
		}
	},
	{
		block: parseIPv6("64:ff9b::"),
		mask: 96,
		// https://datatracker.ietf.org/doc/html/rfc6052
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv4-IPv6"
		}
	},
	{
		block: parseIPv6("::ffff:0:0"),
		mask: 96,
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "IPv4-mapped"
		}
	},
	{
		block: parseIPv6("100::"),
		mask: 64,
		// https://datatracker.ietf.org/doc/html/rfc6666
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "discard"
		}
	},
	{
		block: parseIPv6("2001::"),
		mask: 32,
		// https://datatracker.ietf.org/doc/html/rfc4380
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "terredo"
		}
	},
	{
		block: parseIPv6("2001:2::"),
		mask: 32,
		// https://datatracker.ietf.org/doc/html/rfc5180
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "benchmarking"
		}
	},
	{
		block: parseIPv6("2001:db8::"),
		mask: 32,
		// https://datatracker.ietf.org/doc/html/rfc3849
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "documentation"
		}
	},
	{
		block: parseIPv6("2001:10::"),
		mask: 28,
		// https://datatracker.ietf.org/doc/html/rfc4843
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "orchid"
		}
	},
	{
		block: parseIPv6("2002::"),
		mask: 16,
		// https://datatracker.ietf.org/doc/html/rfc3056
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "6to4"
		}
	},
	{
		block: parseIPv6("fc00::"),
		mask: 7,
		// https://datatracker.ietf.org/doc/html/rfc4193
		attrs: {
			cls: "private",
			family: "IPv6",
		}
	},
	{
		block: parseIPv6("fe80::"),
		mask: 10,
		attrs: {
			cls: "special",
			family: "IPv6",
			msg: "link-local"
		}
	}
]


function classifyIPv4(ipAddress) {
	for (const range of ipv4Ranges) {
		const mask = BigInt(2) ** BigInt(32 - range.mask) - BigInt(1);
		const network = range.block & ~mask;
		const ipNetwork = ipAddress & ~mask;
		
		if (network === ipNetwork) {
			return range.attrs;
		}
	}

	return {
		cls: "public",
		family: "IPv4",
		value: ipAddress,
	}
}

function classifyIPv6(ipAddress) {
	for (const range of ipv6Ranges) {
		const mask = BigInt(2) ** BigInt(128 - range.mask) - BigInt(1);
		const network = range.block & ~mask;
		const ipNetwork = ipAddress & ~mask;
		
		if (network === ipNetwork) {
			return range.attrs;
		}
	}

	return {
		cls: "public",
		family: "IPv6",
		value: ipAddress,
	}
}


/*
	Classify an IP address.
	Input:
		ipAddress - string, IP address to classify
	
	Returns:
		Dictionary
*/

export function classifyIPAddress(ipAddress) {
	let ipv4 = undefined;
	let ipv6 = undefined;

	// Parse IPv4 address
	try {
		ipv4 = parseIPv4(ipAddress);
	} catch (error) {
		return {
			cls: "invalid",
			value: ipAddress,
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
			value: ipAddress,
			msg:"invalid parse ipv6",
		};
	}
	if (ipv6 !== undefined) {
		return classifyIPv6(ipv6);
	}

	return {
		cls: "invalid",
		value: ipAddress,
	};
}
