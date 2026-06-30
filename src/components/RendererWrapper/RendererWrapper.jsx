import React, { useMemo } from 'react';
import { highlightUnicodeChildren } from '../../utils/visualization/visualizeWhitespaces';

// Renderer wraper
export function RendererWrapper({
	children,
	component: Component = 'span', // Default tag, can be overloaded
	...rest
}) {
	const HighlightedChildren = useMemo(() => highlightUnicodeChildren(children), [children]);

	return (
		<Component
			{...rest}
		>
			{HighlightedChildren}
		</Component>
	);
}
