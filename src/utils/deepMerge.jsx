// Function to check if a value is an object but not an array
const isObject = (obj) => obj && (typeof obj === 'object') && !Array.isArray(obj);

// Util function for deep merging of objects
export const deepMerge = (target, ...sources) => {
	// If no sources are provided, return the target object as is
	if (!sources.length) return target;

	// Iterate through each source object provided
	for (const source of sources) {
		// Ensure both target and source are objects before merging
		if (isObject(target) && isObject(source)) {
			// Iterate through each key in the source object
			for (const key in source) {
				// If the value of the current key is an object, perform a recursive deep merge
				if (isObject(source[key])) {
					// If the key does not exist in the target, initialize it as an empty object
					if (!target[key]) {
						target[key] = {};
					}
					// Recursively merge the nested objects
					deepMerge(target[key], source[key]);
				} else {
					// For non-object values, directly assign the value to the target
					target[key] = source[key];
				}
			}
		}
	}

	// Return the merged object
	return target;
};
