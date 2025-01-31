/* 
	The isValidIPAddress function checks if a given IP address is a valid IP address.

	Example of usage:

	const ip1 = '192.168.1.1';
	const result1 = isValidIP(ip1);
	console.log(result1); // Output: true
*/

// Function to check if IP address is valid IPv4 or IPv6 address
export function isValidIP(ip) {
	if ((ip ==  undefined) || (typeof ip !== 'string') || (ip === '')) { // Check  if address is string and not empty
		return false;
	}

	return isValidIPv4(ip) || isValidIPv6(ip);
}

// Function to validate IPv4 address
function isValidIPv4(ip) {
	const octets = ip.split('.'); // Octet is on of the segments of an IP address
	if (octets.length !== 4) return false; // Check if there are exactly 4 octets

	for (const octet of octets) {
		const num = Number(octet);
		if ((num < 0) || (num > 255) || (octet !== String(num))) { // Check if is valid number or has leading zeros
			return false;
		}
	}

	return true; // Valid IPv4
};

//  Function to validate IPv6 address
function isValidIPv6(ip) {
	const blocks = ip.split(':')
	if ((blocks.length < 3) || (blocks.length > 8)) return false; // Check if there are between 3 and 8 blocks

	let doubleColonCount = 0; // Count occurrences of '::'
	for (let block of blocks) {
		if (block === '') {
			doubleColonCount++;
			continue; // Skip empty blocks (indicating '::')
		}

		// Check if the block is a valid hex block
		if (block.length > 4 || !/^[0-9a-fA-F]{0,4}$/.test(block)) { // Regex check for valid hexadecimal digit (numbers 1-9, letters a-f)
			return false;
		}
	}

	return doubleColonCount <= 1; // Valid if '::' appears only once
};
