import { useTranslation } from 'react-i18next';

// Translates content based on the current language setting
// Handles translation of content objects that contain language-specific text
export function translateFromContent(content) {
	const { t, i18n } = useTranslation();
	const currentLang = i18n?.language || 'c';
	const errorMessage = t("General|Content cannot be translated - invalid format");

	// If the content is a string, return it as-is
	if (typeof content === 'string') {
		return content;
	}

	// If the content is not an object, is an array, or is an empty object, return translation error
	if (!content || typeof content !== 'object' || Array.isArray(content) || Object.keys(content).length === 0) {
		console.warn(errorMessage + " " + JSON.stringify(content));
		return errorMessage;
	}

	// Normalize keys to lowercase
	const normalizedKeys = Object.keys(content).reduce((acc, key) => {
		acc[key.toLowerCase()] = content[key];
		return acc;
	}, {});

	// First try to get text in current language, if not found
	// try fallback 'c' language, if still not found
	// try first string value found in object, otherwise
	// return error message
	if (typeof normalizedKeys[currentLang] === 'string') {
		return normalizedKeys[currentLang];
	} else if (typeof normalizedKeys['c'] === 'string') {
		return normalizedKeys['c'];
	} else if (typeof Object.values(normalizedKeys)[0] === 'string') {
		return Object.values(normalizedKeys)[0];
	} else {
		console.warn(errorMessage + " " + JSON.stringify(normalizedKeys));
		return errorMessage;
	}
}
