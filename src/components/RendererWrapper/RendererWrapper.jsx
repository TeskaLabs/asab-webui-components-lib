import React from 'react';
import { visualizeUnicodeChildren } from '../../utils/visualization/visualizeWhitespaces';
import { highlightChildren } from '../../utils/highlighting/highlightChildren.jsx';

// Renderer wraper
export function RendererWrapper({
	children,
	component: Component = 'span', // Default tag, can be overloaded
	...rest
}) {
	const dataValue = rest?.['data-value'];
	let processedChildren = visualizeUnicodeChildren(children);

	const fulltextTerms = rest?.fulltextHighlightTerms;

	// If fulltextTerms is provided, highlight searched terms in the children
	if (fulltextTerms) {
		processedChildren = highlightChildren(processedChildren, fulltextTerms, dataValue);
	}

	return (
		<Component
			{...rest}
		>
			{processedChildren}
		</Component>
	);
}
