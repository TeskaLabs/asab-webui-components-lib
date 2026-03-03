import { useTranslation } from 'react-i18next';
/**
 * Custom hook that wraps the default i18next `t` function
 * and post-processes the translated string to decode HTML entities.
 *
 * Purpose:
 * - Keep i18next interpolation escaping enabled (escapeValue: true)
 * - Avoid displaying encoded entities like &#x2F; in the UI
 * - Preserve XSS safety while rendering clean, human-readable text
 */

export const useSafeTranslation = () => {
	const { t } = useTranslation();
	/**
	 * Safe translation wrapper.
	 *
	 * @param {string} key - Translation key
	 * @param {object} options - Interpolation and translation options
	 * @returns {string} - Decoded translation string safe for React rendering
	 *
	 * What it does:
	 * 1. Calls i18next translation function (with default escaping enabled)
	 * 2. Receives escaped string (e.g., &#x2F; instead of /)
	 * 3. Decodes HTML entities back to readable characters
	 * 4. Returns safe string to be rendered by React
	 */
	const safeT = (key, options) => {
		// Call i18next translation function
		const translated = t(key, options);

		// Decode HTML entities (e.g., &#x2F; -> /)
		// This ensures the UI shows readable characters instead of entity codes.
		// React will still escape the string during rendering, so this does NOT introduce XSS vulnerabilities.
		return decodeHtmlEntities(translated);
	};

	// Return wrapped translation function instead of raw `t`
	return { safeT };
};



/**
 * Decodes HTML entities into their original characters.
 *
 * Example:
 *   Input:  "Do you want to remove &#x2F;Parsers&#x2F;Test?"
 *   Output: "Do you want to remove /Parsers/Test?"
 *
 * Why this is needed:
 * - i18next escapes interpolation values to prevent XSS
 * - React already safely escapes strings during rendering
 * - Without decoding, encoded entities appear in the UI
 *
 * Security:
 * - This function does NOT execute HTML
 * - It only converts entity codes to characters
 */
const decodeHtmlEntities = (text) => {
	// If running in a non-browser environment (e.g., SSR), return the original text because DOMParser is not available.
	if (typeof window === 'undefined') return text;

	// Create a new DOMParser instance. DOMParser is a built-in browser API used to parse HTML strings.
	const parser = new DOMParser();

	// Parse the input string as an HTML document. The browser automatically converts HTML entities into characters.
	const doc = parser.parseFromString(text, 'text/html');

	// Extract only the text content from the parsed document. This returns decoded characters without executing any scripts.
	return doc.documentElement.textContent;
};