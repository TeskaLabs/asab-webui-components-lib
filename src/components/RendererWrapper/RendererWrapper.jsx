import React from 'react';

// Renderer wraper
export function RendererWrapper({
	children,
	component: Component = 'span', // Default tag, can be overloaded
	...rest
}) {
	return (
		<Component
			{...rest}
		>
			{children}
		</Component>
	);
}
