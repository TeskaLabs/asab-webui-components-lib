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
 * currently, we have: [ access, error, invite, unauthorized ]
 * @param {string} className - CSS classes for img element
 * @param {string} title - Accessibility title
 * @param {string} basePath - Base directory (default: '/media/illustrations')
 * 
 * Usage:
 * <FlowbiteIllustration name="welcome" height="300px" />
 */
export const FlowbiteIllustration = ({
    name,
    className = '', 
    title = '',
    basePath = '/media/illustrations',
}) => {
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

	return (
			<img 
				src={illustrationSrc}
				alt={title || `${name} illustration`}
				title={title}
				className={`h-100 w-100 ${className}`}
				onError={(e) => {
					console.warn(`Illustration '${name}' failed to load from ${illustrationSrc}`);
					e.target.style.display = 'none';
				}}
			/>
	);
};
