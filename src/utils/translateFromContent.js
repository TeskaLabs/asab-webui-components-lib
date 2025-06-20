import i18n from 'i18next';

export function translateFromContent(content) {
	const currentLang = (i18n?.language || '').toLowerCase();
	// console.log(i18n.language);
	// const currentLang = 'de';
	// console.log(currentLang)

	if (typeof content === 'string') {
		return content;
	}

	if (!content || typeof content !== 'object' || Array.isArray(content)) {
		return '';
	}

	const normalizedKeys = Object.keys(content).reduce((acc, key) => {
		acc[key.toLowerCase()] = content[key];
		return acc;
	}, {});

	return (
		normalizedKeys[currentLang] || normalizedKeys['c'] || Object.values(normalizedKeys)[0] || ''
	);
}