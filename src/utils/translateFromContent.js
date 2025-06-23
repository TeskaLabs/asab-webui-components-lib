import i18n from 'i18next';

// Translates content based on the current language setting
// Handles translation of content objects that contain language-specific text
export function translateFromContent(content) {
	const currentLang = (i18n?.language || 'c').toLowerCase();

	// If the content is a string, return it as-is
	if (typeof content === 'string') {
		return content;
	}

	// If the content is not an object (or is an array), return empty string
	if (!content || typeof content !== 'object' || Array.isArray(content)) {
		return '';
	}

	// Normalize keys to lowercase
	const normalizedKeys = Object.keys(content).reduce((acc, key) => {
		acc[key.toLowerCase()] = content[key];
		return acc;
	}, {});

	// Return the translation for the current language with fallback to 'c' and first available translation
	return normalizedKeys[currentLang] || normalizedKeys['c'] || Object.values(normalizedKeys)[0] || '';
}
