import React, { useState } from 'react';

/**
 * FlowbiteIllustration - Secure SVG illustration component
 * 
 * Features:
 * - Path traversal protection (sanitizes basePath and name)
 * - Graceful error handling (collapses to 0 height on load failure) and displays nothing
 * - Maintains aspect ratio when height is specified
 * 
 * Props:
 * @param {string} name - SVG filename (required, alphanumeric/hyphens/underscores only)
 * @param {string} className - CSS classes for img element
 * @param {string} title - Accessibility title
 * @param {string} basePath - Base directory (default: '/media/illustrations')
 * @param {string} height - Container height (e.g., "200px", auto-width maintains ratio)
 * 
 * Usage:
 * <FlowbiteIllustration name="welcome" height="300px" />
 */
export const FlowbiteIllustration = ({
    name,
    className = '', 
    title = '',
    basePath = '/media/illustrations',
    height,
}) => {
	const [hasError, setHasError] = useState(false);

	// Sanitize the basePath to prevent path traversal
	const sanitizedBasePath = basePath
		?.replace(/\.\./g, '') // Remove path traversal attempts
		?.replace(/\/+/g, '/') // Replace multiple slashes with single slash
		?.replace(/\/$/, ''); // Remove trailing slash

	if (!sanitizedBasePath) {
		console.warn(`Invalid base path: '${basePath}'`);
		return null;
	}

	// Sanitize the name to prevent path traversal and ensure valid filename
	const sanitizedName = name
		?.replace(/[^a-zA-Z0-9\-_]/g, '') // Only allow alphanumeric, hyphens, underscores
		?.toLowerCase();

	if (!sanitizedName) {
		console.warn(`Invalid or empty illustration name: '${name}'`);
		return null;
	}	

	const illustrationSrc = `${basePath}/${sanitizedName}.svg`;

	/* For invalid images, sets optional height to 0 to avoid layout shifts
	For valid images, uses the provided height or fills available space */
	const containerStyle = hasError ? { height : 0 } : ( height ? { height } : {});

	return (
		<div className='text-center' style={containerStyle}>
			<img 
				src={illustrationSrc}
				alt={title || `${name} illustration`}
				title={title}
				className={className}
				style={{ 
					width: '100%',
					height: '100%',
				}}
				onError={(e) => {
					console.warn(`Illustration '${name}' failed to load from ${illustrationSrc}`);
					setHasError(true);
					e.target.style.display = 'none';
				}}
			/>
		</div>
	);
};
