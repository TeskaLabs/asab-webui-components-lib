import React from 'react';

/*
	Unicode code points and ranges for whitespace, invisible, bidi,
	control and other problematic characters (log smuggling / Trojan Source).
*/

// Possible whitespace unicode code points
export const SPECIAL_UNICODE_CODE_POINTS = new Set([
	// Whitespace
	0x0009, // Tab (HT)
	0x000A, // Line Feed (LF)
	0x000B, // Vertical Tab
	0x000C, // Form Feed
	0x000D, // Carriage Return (CR)
	0x0085, // Next Line (NEL)
	0x00A0, // No-Break Space
	0x1680, // Ogham Space Mark
	0x2028, // Line Separator
	0x2029, // Paragraph Separator
	0x202F, // Narrow No-Break Space
	0x205F, // Medium Mathematical Space
	0x3000, // Ideographic Space
	0x180E, // Mongolian Vowel Separator (formerly whitespace)

	// Zero-width / invisible
	0x200B, // Zero Width Space
	0x200C, // Zero Width Non-Joiner
	0x200D, // Zero Width Joiner
	0x2060, // Word Joiner
	0xFEFF, // Zero Width No-Break Space / BOM
	0x00AD, // Soft Hyphen
	0x034F, // Combining Grapheme Joiner
	0x115F, // Hangul Choseong Filler
	0x1160, // Hangul Jungseong Filler
	0x3164, // Hangul Filler
	0xFFA0, // Halfwidth Hangul Filler
	0x17B4, // Khmer Vowel Inherent Aq
	0x17B5, // Khmer Vowel Inherent Aa

	// Bidirectional control (Trojan Source)
	0x200E, // Left-to-Right Mark
	0x200F, // Right-to-Left Mark
	0x061C, // Arabic Letter Mark

	// C0 / C1 controls (selected singles)
	0x0000, // Null
	0x001B, // Escape
	0x007F, // Delete

	// Other problematic
	0xFFFC, // Object Replacement Character
	0xFFFD, // Replacement Character
	0xFFFE, // Noncharacter
	0xFFFF, // Noncharacter
]);

// Possible whitespace unicode code point ranges
export const SPECIAL_UNICODE_RANGES = [
	// Whitespace
	[0x2000, 0x200A], // En/Em quad, En/Em space, thin/hair space, etc.

	// Bidirectional control
	[0x202A, 0x202E], // LRE, RLE, PDF, LRO, RLO
	[0x2066, 0x2069], // LRI, RLI, FSI, PDI

	// C0 / C1 controls
	[0x0001, 0x0008], // SOH–BS
	[0x000E, 0x001F], // SO–US
	[0x0080, 0x009F], // C1 controls (incl. NEL U+0085, CSI U+009B)

	// Other problematic
	[0xFFF9, 0xFFFB], // Interlinear annotation
	[0xFDD0, 0xFDEF], // Noncharacters
	[0xE0000, 0xE007F], // Tag characters (ASCII smuggling)
	[0xE0100, 0xE01EF], // Variation Selectors Supplement
	[0xFE00, 0xFE0F], // Variation Selectors
	[0xD800, 0xDFFF], // Surrogates (invalid standalone)
	[0xE000, 0xF8FF], // Private Use Area (BMP)
	[0xF0000, 0xFFFFD], // Private Use Area (supplementary)
	[0x100000, 0x10FFFD], // Private Use Area (supplementary)
	[0x2400, 0x2426], // Control Pictures (display glyphs)
];

// Check if a unicode code point is a special unicode code point
export function isSpecialUnicodeCodePoint(codePoint) {
	if (SPECIAL_UNICODE_CODE_POINTS.has(codePoint)) {
		return true;
	}
	return SPECIAL_UNICODE_RANGES.some(([start, end]) => codePoint >= start && codePoint <= end);
}

const ASCII_SPACE = 0x20;

// Format a unicode code point to a hex string
function formatCodePointHex(codePoint) {
	const hex = codePoint.toString(16).toUpperCase();
	return hex.length < 4 ? hex.padStart(4, '0') : hex;
}

// Get the leading and trailing edges of the ascii space in a string
function getAsciiSpaceEdges(value) {
	let leadingEnd = 0;

	while (leadingEnd < value.length && (value.codePointAt(leadingEnd) === ASCII_SPACE || isSpecialUnicodeCodePoint(value.codePointAt(leadingEnd)))) {
		leadingEnd += 1;
	}

	let trailingStart = value.length;
	while (trailingStart > leadingEnd && (value.codePointAt(trailingStart - 1) === ASCII_SPACE || isSpecialUnicodeCodePoint(value.codePointAt(trailingStart - 1)))) {
		trailingStart -= 1;
	}

	return { leadingEnd, trailingStart };
}

// Highlight whitespaces in a string
export function highlightWhitespaces(value) {
	if ((value == null) || (typeof value !== 'string') || (value.length === 0)) {
		return value;
	}

	const { leadingEnd, trailingStart } = getAsciiSpaceEdges(value);
	const nodes = [];

	for (let i = 0; i < value.length;) {
		const codePoint = value.codePointAt(i);
		const char = String.fromCodePoint(codePoint);

		if (codePoint === ASCII_SPACE) {
			const isEdgeSpace = i < leadingEnd || i >= trailingStart;

			if (isEdgeSpace) {
				nodes.push(
					<span key={`${i}-20`} className='renderer-whitespace m-0'>
						*
					</span>,
				);
			} else {
				nodes.push(' ');
			}
		} else if (isSpecialUnicodeCodePoint(codePoint)) {
			const hexUnicode = formatCodePointHex(codePoint);

			nodes.push(
				<span key={`${i}-${hexUnicode}`} className='renderer-whitespace'>
					{`<${hexUnicode}>`}
				</span>,
			);
		} else {
			nodes.push(char);
		}

		i += codePoint > 0xFFFF ? 2 : 1;
	}

	return nodes;
}

export const highlightUnicodeChildren = (children) => {
	if (typeof children === 'string' || typeof children === 'number') {
		return highlightWhitespaces(String(children));
	}

	return children;
};

export const createUnicodeHighlightWrapper = (BaseWrapper) => {
    const UnicodeHighlightWrapper = (props) => {
		const { children, ...rest } = props;
		const highlightedChildren = highlightUnicodeChildren(children);
		return <BaseWrapper {...rest}>{highlightedChildren}</BaseWrapper>;
	};
	UnicodeHighlightWrapper.displayName = `UnicodeHighlightWrapper(${BaseWrapper.displayName || BaseWrapper.name || 'Component'})`;
	return UnicodeHighlightWrapper;
};