import React from 'react';
import { visualizeUnicodeChildren } from '../../utils/visualization/visualizeWhitespaces';
import { highlightChildren } from '../../utils/highlighting/highlightChildren.jsx';

// Renderer wraper
export function RendererWrapper({
	children,
	component: Component = 'span', // Default tag, can be overloaded
	fulltextHighlightTerms, // Fulltext highlight terms to highlight in the children
	...rest
}) {
	const dataValue = rest?.['data-value'];
	let processedChildren = visualizeUnicodeChildren(children);

	// If fulltextHighlightTerms is provided, highlight searched terms in the children
	if (fulltextHighlightTerms) {
		processedChildren = highlightChildren(processedChildren, fulltextHighlightTerms, dataValue);
	}

	return (
		<Component
			{...rest}
		>
			{processedChildren}
		</Component>
	);
}
