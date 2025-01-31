/*
itemExtensionHandler checks if the variable has an extension and returns it
This function takes 2 arguments:
	- itemName - string
	- extension - string, file extension in this format '.json' or '.yaml'
 */
export function itemExtensionHandler(itemName, extension) {
	// Get the last five characters of itemName for extension checking
	const lastFiveChars = itemName.slice(-5);
	// Check if itemName already has an extension that's not '.io' or '.d'
	if (lastFiveChars.includes('.') && !itemName.endsWith('.io') && !itemName.endsWith('.d')) {
		// If itemName has a non-special extension, return the original itemName
		return itemName;
	}

	// If itemName has no valid extension, add the new extension
	return `${itemName}${extension}`;
}
