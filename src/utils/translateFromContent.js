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

	// If content is null, not an object, or is an array, return error message
	if (!content || typeof content !== 'object' || Array.isArray(content)) {
		console.warn(errorMessage + " " + content);
		return errorMessage;
	}

	// Normalize keys to lowercase
	const normalizedKeys = Object.keys(content).reduce((acc, key) => {
		acc[key.toLowerCase()] = content[key];
		return acc;
	}, {});

	// If the normalizedKeys object is empty, return empty string
	if (Object.keys(normalizedKeys).length === 0) {
		console.warn('Content for translation is empty');
		return '';
	}

	/* Try to get text in current language
	if not found try fallback 'c' language
	otherwise return error message */
	if (typeof normalizedKeys[currentLang] === 'string') {
		return normalizedKeys[currentLang];
	}
	
	if (typeof normalizedKeys['c'] === 'string') {
		return normalizedKeys['c'];
	}

	console.warn(content);
	return errorMessage;
}
