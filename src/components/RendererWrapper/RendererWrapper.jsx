import React, { useMemo } from 'react';
import { visualizeUnicodeChildren } from '../../utils/visualization/visualizeWhitespaces';

// Renderer wraper
export function RendererWrapper({
	children,
	component: Component = 'span', // Default tag, can be overloaded
	...rest
}) {
	const HighlightedChildren = useMemo(() => visualizeUnicodeChildren(children), [children]);

	return (
		<Component
			{...rest}
		>
			{HighlightedChildren}
		</Component>
	);
}
