export const normalizeEscapedString = (input) => {
	// Ensure we are working with a string
	if (typeof input !== 'string') {
		return input;
	}

	// If running outside the browser (e.g., SSR), DOMParser will not be available — return string as-is.
	if (typeof window === 'undefined') {
		return input;
	}

	// Create a temporary textarea element. The browser automatically decodes HTML entities when setting innerHTML on a textarea.
	const textarea = document.createElement('textarea');

	// Assign the escaped string to innerHTML. The browser parses HTML entities here.
	textarea.innerHTML = input;

	// Read the decoded value from `value`.This returns a clean string with entities converted back.
	return textarea.value;
};
