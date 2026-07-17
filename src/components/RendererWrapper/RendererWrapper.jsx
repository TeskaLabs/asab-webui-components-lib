import React from 'react';
import { visualizeInvisibleCharacters } from '../../utils/textFormatting/visualizeInvisibleCharacters.jsx';
import { highlightChildren } from '../../utils/textFormatting/highlightChildren.jsx';

// Renderer wraper
export function RendererWrapper({
	children,
	component: Component = 'span', // Default tag, can be overloaded
	...rest
}) {
	const dataValue = rest?.['data-value'];
	// Visualize invisible characters in the children
	let processedChildren = visualizeInvisibleCharacters(children);
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
