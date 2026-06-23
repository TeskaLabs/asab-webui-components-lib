import React from 'react';

// Regex to escape special characters to prevent the app to crash in search value
const ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/g;

// Normalize search terms
const normalizeSearchTerms = (searchValue) => {
	if (Array.isArray(searchValue)) {
		return searchValue
			.map((term) => String(term).trim())
			.filter(Boolean);
	}

	if (typeof searchValue === 'string') {
		return searchValue
			.trim()
			.split(/\s+/)
			.filter(Boolean);
	}

	return [];
};

// Highlight searched fulltexts in the text by replacing matched terms with a span
export const highlightSearchedFulltexts = (text, searchValue, highlightClassName = 'bg-warning') => {
	const sourceText = String(text ?? '');
	const terms = normalizeSearchTerms(searchValue);

	if (terms.length === 0 || sourceText === '') {
		return sourceText;
	}

	const escapedTerms = [...new Set(terms.map((term) => term.replace(ESCAPE_REGEX, '\\$&')))]
		.sort((a, b) => b.length - a.length);
	const matchRegex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
	const highlightedTerms = new Set(terms.map((term) => term.toLowerCase()));

	return sourceText.split(matchRegex).map((part, index) => {
		if (highlightedTerms.has(part.toLowerCase())) {
			return (
				<span key={`${part}-${index}`} className={highlightClassName}>
					{part}
				</span>
			);
		}

		return part;
	});
};
