import { useTranslation } from 'react-i18next';

export const useSafeTranslation = () => {
	const { t } = useTranslation();

	const safeT = (key, options) => {
		const translated = t(key, options); // escapeValue по умолчанию true
		return decodeHtmlEntities(translated);
	};

	return { safeT };
};

const decodeHtmlEntities = (text) => {
	if (typeof window === 'undefined') return text;

	const parser = new DOMParser();
	const doc = parser.parseFromString(text, 'text/html');
	return doc.documentElement.textContent;
};