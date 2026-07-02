import React from 'react';
import { highlightSearchedFulltexts } from './highlightSearchedFulltexts.js';

const isPrimitiveHighlightValue = (value) => (
	value != null && (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint')
);

const highlightText = (text, fulltextHighlightTerms) => (
	highlightSearchedFulltexts(String(text), fulltextHighlightTerms)
);

// Apply fulltext highlight to children (string, whitespace node array, or nested elements)
export const highlightChildren = (children, fulltextHighlightTerms, dataValue) => {
	if (!fulltextHighlightTerms?.length) {
		return children;
	}

	if (typeof children === 'string' || typeof children === 'number') {
		return highlightText(children, fulltextHighlightTerms);
	}

	// Whitespace renderer output: apply fulltext to string runs, keep unicode markers as-is
	if (Array.isArray(children)) {
		return children.flatMap((node) => {
			if (typeof node === 'string' || typeof node === 'number') {
				const highlighted = highlightText(node, fulltextHighlightTerms);
				return Array.isArray(highlighted) ? highlighted : [highlighted];
			}

			if (!React.isValidElement(node)) {
				return [node];
			}

			const highlightedNode = highlightChildren(
				node,
				fulltextHighlightTerms,
				dataValue,
			);

			return Array.isArray(highlightedNode) ? highlightedNode : [highlightedNode];
		});
	}

	if (React.isValidElement(children)) {
		const nestedDataValue = children.props?.['data-value'] ?? dataValue;

		if (typeof children.type === 'string' || children.type === React.Fragment) {
			return React.cloneElement(
				children,
				children.props,
				highlightChildren(
					children.props?.children,
					fulltextHighlightTerms,
					nestedDataValue,
				),
			);
		}

		if (isPrimitiveHighlightValue(nestedDataValue)) {
			return highlightText(nestedDataValue, fulltextHighlightTerms);
		}

		return children;
	}

	if (isPrimitiveHighlightValue(dataValue)) {
		return highlightText(dataValue, fulltextHighlightTerms);
	}

	return children;
};
