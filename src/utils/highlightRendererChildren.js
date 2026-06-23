import React from 'react';
import { highlightFulltextInNodes } from './highlightWhitespaces.js';
import { highlightSearchedFulltexts } from './highlightSearchedFulltexts.js';

const isPrimitiveHighlightValue = (value) => (
	value != null && (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint')
);

const highlightText = (text, fulltextHighlightTerms, highlightClassName) => (
	highlightSearchedFulltexts(String(text), fulltextHighlightTerms, highlightClassName)
);

// Apply fulltext highlight to renderer children (string, whitespace node array, or nested elements)
export const highlightRendererChildren = (children, fulltextHighlightTerms, dataValue, highlightClassName) => {
	if (!fulltextHighlightTerms?.length) {
		return children;
	}

	if (typeof children === 'string' || typeof children === 'number') {
		return highlightText(children, fulltextHighlightTerms, highlightClassName);
	}

	// Whitespace renderer output: apply fulltext to string runs, keep unicode markers as-is
	if (Array.isArray(children)) {
		return highlightFulltextInNodes(
			children,
			(text) => highlightText(text, fulltextHighlightTerms, highlightClassName),
		).flatMap((node) => {
			if (!React.isValidElement(node)) {
				return [node];
			}

			const highlightedNode = highlightRendererChildren(
				node,
				fulltextHighlightTerms,
				dataValue,
				highlightClassName,
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
				highlightRendererChildren(
					children.props?.children,
					fulltextHighlightTerms,
					nestedDataValue,
					highlightClassName,
				),
			);
		}

		if (isPrimitiveHighlightValue(nestedDataValue)) {
			return highlightText(nestedDataValue, fulltextHighlightTerms, highlightClassName);
		}

		return children;
	}

	if (isPrimitiveHighlightValue(dataValue)) {
		return highlightText(dataValue, fulltextHighlightTerms, highlightClassName);
	}

	return children;
};

// Wrap a renderer wrapper component with fulltext search highlighting
export const createFulltextHighlightWrapper = (BaseWrapper, fulltextHighlightTerms, highlightClassName) => {
	const FulltextHighlightWrapper = (props) => {
		const { children, ...rest } = props;
		const highlightedChildren = highlightRendererChildren(
			children,
			fulltextHighlightTerms,
			rest['data-value'],
			highlightClassName,
		);
		return <BaseWrapper {...rest}>{highlightedChildren}</BaseWrapper>;
	};
	FulltextHighlightWrapper.displayName = `FulltextHighlightWrapper(${BaseWrapper.displayName || BaseWrapper.name || 'Component'})`;
	return FulltextHighlightWrapper;
};
