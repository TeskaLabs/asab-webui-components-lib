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
		class: "IPv4 private"
	},
	{
		block: parseIPv4("172.16.0.0"),
		mask: 12,
		class: "IPv4 private"  // https://datatracker.ietf.org/doc/html/rfc1918
	},
	{
		block: parseIPv4("192.168.0.0"),
		mask: 16,
		class: "IPv4 private"
	},
	{
		block: parseIPv4("169.254.0.0"),
		mask: 24,
		class: "IPv4 reserved"
	},
	{
		block: parseIPv4("169.254.255.0"),
		mask: 24,
		class: "IPv4 reserved"
	},
	{
		block: parseIPv4("169.254.0.0"),
		mask: 16,
		class: "IPv4 link-local"  // https://datatracker.ietf.org/doc/html/rfc3927
	},
	{
		block: parseIPv4("100.64.0.0"),
		mask: 10,
		class: "IPv4 SAS"  // Shared Address Space  https://datatracker.ietf.org/doc/html/rfc6598
	},
	{
		block: parseIPv4("127.0.0.0"),
		mask: 8,
		class: "IPv4 loopback"
	},
	{
		block: parseIPv4("0.0.0.0"),
		mask: 8,
		class: "IPv4 special"
	},
	{
		block: parseIPv4("192.0.0.0"),
		mask: 29,
		class: "IPv4 ds-lite" // https://datatracker.ietf.org/doc/html/rfc6333
	},
	{
		block: parseIPv4("192.0.2.0"),
		mask: 24,
		class: "IPv4 documentation"  // https://datatracker.ietf.org/doc/html/rfc5737
	},
	{
		block: parseIPv4("192.88.99.0"),
		mask: 24,
		class: "IPv4 6to4"  // RFC3068
	},
	{
		block: parseIPv4("198.18.0.0"),
		mask: 15,
		class: "IPv4 benchmarking"  // https://datatracker.ietf.org/doc/html/rfc2544
	},
	{
		block: parseIPv4("198.51.100.0"),
		mask: 24,
		class: "IPv4 documentation"  // https://datatracker.ietf.org/doc/html/rfc5737
	},
	{
		block: parseIPv4("203.0.113.0"),
		mask: 24,
		class: "IPv4 documentation"  // https://datatracker.ietf.org/doc/html/rfc5737
	},
	{
		block: parseIPv4("240.0.0.0"),
		mask: 4,
		class: "IPv4 reserved" // [RFC1112], Section 4
	},
	{
		block: parseIPv4("255.255.255.255"),
		mask: 32,
		class: "IPv4 limited-broadcast"  //  RFC0919], Section 7
	}	
]

const ipv6Ranges = [
	{
		block: parseIPv6("::1"),
		mask: 128,
		class: "IPv6 loopback"  // https://datatracker.ietf.org/doc/html/rfc4291
	},
	{
		block: parseIPv6("::"),
		mask: 128,
		class: "IPv6 unspecified"  // https://datatracker.ietf.org/doc/html/rfc4291
	},
	{
		block: parseIPv6("64:ff9b::"),
		mask: 96,
		class: "IPv6 IPv4-IPv6"  // https://datatracker.ietf.org/doc/html/rfc6052
	},
	{
		block: parseIPv6("::ffff:0:0"),
		mask: 96,
		class: "IPv6 IPv4-mapped"  // https://datatracker.ietf.org/doc/html/rfc4291
	},
	{
		block: parseIPv6("100::"),
		mask: 64,
		class: "IPv6 discard"  // https://datatracker.ietf.org/doc/html/rfc6666
	},
	{
		block: parseIPv6("2001::"),
		mask: 32,
		class: "IPv6 terredo"  // https://datatracker.ietf.org/doc/html/rfc4380
	},
	{
		block: parseIPv6("2001:2::"),
		mask: 32,
		class: "IPv6 benchmarking"  // https://datatracker.ietf.org/doc/html/rfc5180
	},
	{
		block: parseIPv6("2001:db8::"),
		mask: 32,
		class: "IPv6 documentation"  // https://datatracker.ietf.org/doc/html/rfc3849
	},
	{
		block: parseIPv6("2001:10::"),
		mask: 28,
		class: "IPv6 orchid"  // https://datatracker.ietf.org/doc/html/rfc4843
	},
	{
		block: parseIPv6("2002::"),
		mask: 16,
		class: "IPv6 6to4"  // https://datatracker.ietf.org/doc/html/rfc3056
	},
	{
		block: parseIPv6("fc00::"),
		mask: 7,
		class: "IPv6 private"  // https://datatracker.ietf.org/doc/html/rfc4193
	},
	{
		block: parseIPv6("fe80::"),
		mask: 10,
		class: "IPv6 link-local"  // https://datatracker.ietf.org/doc/html/rfc4291
	}
]

function classifyIPv4(ipAddress) {
	const ip = BigInt(ipAddress); // Ensure input is BigInt

	for (const range of ipv4Ranges) {
		const mask = (1n << BigInt(32 - range.mask)) - 1n;
		const network = range.block & ~mask;
		const ipNetwork = ip & ~mask;

		if (network === ipNetwork) {
			return range.class;
		}
	}

	return "IPv4 public";
}

function classifyIPv6(ipAddress) {
	const ip = BigInt(ipAddress); // Ensure input is BigInt

	for (const range of ipv6Ranges) {
		const mask = (1n << BigInt(128 - range.mask)) - 1n;
		const network = range.block & ~mask;
		const ipNetwork = ip & ~mask;

		if (network === ipNetwork) {
			return range.class;
		}
	}

	return "IPv6 public";
}


/*
	Classify an IP address.
	Input:
		ipAddress - string, IP address to classify
	
	Returns:
		"IPv4 private"
		"IPv4 public"
		"IPv4 ..."
		"IPv6 private"
		"IPv6 public"
		"IPv6 ..."
		"invalid" ... for invalid IP address
		"invalid parse ipv4" ... for invalid IPv4 address
		"invalid parse ipv6" ... for invalid IPv6 address

	The first word is "IPv4", "IPv6" or "invalid".
	
	If the second word is "private", it means that the IP address is private.
	If the second word is "public", it means that the IP address is public.
	Any other second word means "special".
*/

export function classifyIPAddress(ipAddress) {
	let ipv4 = undefined;
	let ipv6 = undefined;

	// Parse IPv4 address
	try {
		ipv4 = parseIPv4(ipAddress);
	} catch (error) {
		return "invalid parse ipv4";
	}
	if (ipv4 !== undefined) {
		return classifyIPv4(ipv4);
	}

	// Parse IPv6 address
	try {
		ipv6 = parseIPv6(ipAddress);
	} catch (error) {
		return "invalid parse ipv6";
	}
	if (ipv6 !== undefined) {
		return classifyIPv6(ipv6);
	}

	return "invalid";  // Means invalid IP address
}
