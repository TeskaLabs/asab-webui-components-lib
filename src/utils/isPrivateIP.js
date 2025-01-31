/* 
	The isPrivateIP function checks if a given IP address is a private IP address.
	This function supports both IPv4 and IPv6 formats.

	Example of usage:

	const ip1 = '192.168.1.1';
	const result1 = isPrivate(ip1);
	console.log(result1); // Output: true
*/

// Utility function to check if an IP address is private
export function isPrivateIP(ip) {
	const privateIPv4Ranges = [
		/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
		/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
		/^192\.168\.\d{1,3}\.\d{1,3}$/
	];

	const privateIPv6Ranges = [
		/^fc00:/,
		/^fd00:/
	];

	// Check if the IP is a private IPv4 address
	if (privateIPv4Ranges.some(range => range.test(ip))) {
		return true;
	}

	// Check if the IP is a private IPv6 address
	if (privateIPv6Ranges.some(range => range.test(ip))) {
		return true;
	}

	return false;
}
