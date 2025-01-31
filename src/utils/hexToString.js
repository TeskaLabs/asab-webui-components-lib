/*
	The hexToString function converts a hexadecimal string into its corresponding ASCII string

	Example of usage:

	const hex = '48656c6c6f20576f726c64'
	const asciiString = hexToString(hex);
	
	console.log(asciiString); // Output: 'Hello World'

*/

// Convert a hex string into ASCII string
export function hexToString(hex) {
	let str = '';
	for (let i = 0; i < hex.length; i += 2) {
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	}
	return str;
};
