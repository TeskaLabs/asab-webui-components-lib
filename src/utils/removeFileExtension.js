/**
	Removes the file extension from a given string (path).

	This function takes a string as input and returns the string without
	the file extension. If the input does not have an extension, it returns
	the original string. If the input is null or undefined, it will also
	return the original value.
	@param {string} item - The file path or name from which to remove the extension.
	@returns {string} The path or name without the file extension.
 */
export function removeFileExtension(item) {
	// Check if the item has an extension and is not '.io' or '.d'
	if (item.endsWith('.io') || item.endsWith('.d')) {
		return item; // Return the original item if it matches the conditions
	}

	// Remove file extension using regex and return the modified string,
	// or return the original item if no extension exists.
	return item.replace(/\.[^.]+$/, '') || item;
}
