import { ipCategories } from './lookups/ipCategories';

/*
	JavaScript does not natively handle 128-bit integers,
	which are needed to represent IPv6 addresses fully.
	Instead, operations on IPv6 addresses typically involve converting them
	into a binary format or a numeric representation (e.g., using BigInt)
*/

// Function to convert an IPv6 address to a BigInt
function ipv6ToBigInt(ip) {
	/*
		Full IPv6 addresses should have 8 blocks
		The :: represents the missing blocks of 0000
		Example: "2001:db8::1" -> "2001:db8:0000:0000:0000:0000:0000:1"
	*/

	// Expand shorthand IPv6
	const expanded = ip.replace(/::/, match => {
		const colons = ip.match(/:/g).length; // Count total number of ":"
		const fillZeroes = ':0'.repeat(8 - colons).slice(1); // Calculate how many "0000" blocks are missing - (":0" is shorthand of "0000")

		return match + fillZeroes; // Replace "::" with the correct number of zero-filled groups
	});

	return expanded
		.split(':') // Split the expanded IPv6 address into its individual segments (separated by ":")
		.map(part => BigInt(parseInt(part || '0', 16))) // Convert each segment from hexadecimal to a BigInt value
		.reduce((total, segment) => (total << BigInt(16)) + segment, BigInt(0)); // Combine all segments into a single 128-bit BigInt by shifting and adding
}

// Function to calculate the range of a CIDR block (first and last IP addresses)
function calculateRangeBigInt(cidr) {
	const [baseIp, prefixLength] = cidr.split('/'); // Split the CIDR into the base IP and the prefix length
	const baseBigInt = ipv6ToBigInt(baseIp); // Convert the base IP address from IPv6 format to a BigInt
	const maskBits = BigInt(128 - parseInt(prefixLength)); // Calculate the number of host bits (128 - prefix length)

	// Calculate the first address in the range
	const firstAddress = baseBigInt & (~BigInt(0) << maskBits); // Mask the upper bits to keep the network part intact and set the host part to 0

	// Calculate the last address in the range
	const lastAddress = baseBigInt | ((BigInt(1) << maskBits) - BigInt(1)); // Set the host part to all 1

	return { firstAddress, lastAddress };
}

// Function to check if an IP address is within a CIDR range
function isWithinRangeBigInt(ip, cidr) {
	const ipBigInt = ipv6ToBigInt(ip); // Convert the IP address from IPv6 string format to BigInt
	const { firstAddress, lastAddress } = calculateRangeBigInt(cidr); // Calculate the first and last addresses in the CIDR range using the provided CIDR

	return ipBigInt >= firstAddress && ipBigInt <= lastAddress;  // Check if the IP address falls within the range by comparing it with the first and last addresses
}

// Function to check if IP address is a special case and return it's usage
export function isSpecialIPv6(ip) {
	for (const category of ipCategories) {
		if (isWithinRangeBigInt(ip, category.cidr)) {
			return category.usage;
		}
	}

	return null;
}
