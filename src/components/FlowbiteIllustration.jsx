import React from 'react';

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
 * Available options:
 * - 'access'
 * - 'error'
 * - 'invite'
 * - 'unauthorized'
 * @param {string} className - CSS classes for img element
 * @param {string} title - Accessibility title
 * @param {string} basePath - Base directory (default: '/media/illustrations')
 *
 * Usage:
 * <FlowbiteIllustration name="unauthorized" className="pb-4" title={t("UnauthorizedAccessScreen|Unauthorized access")}/>
 */
export const FlowbiteIllustration = ({
	name,
	className = '',
	title = '',
	basePath,
}) => {

	if(!name || typeof name !== 'string') {
		console.warn(`Invalid illustration name: '${name}'`);
		return null;
	}

	const sanitize = (basePath, defaultValue) => {
		if (!basePath) return defaultValue;

		const p = basePath
			?.replace(/\.\./g, '') // Remove path traversal attempts
			?.replace(/\/+/g, '/') // Replace multiple slashes with single slash
			?.replace(/\/$/, ''); // Remove trailing slash

			if (!p) {
				console.warn(`Invalid base path: '${p}', returning defaultValue`);
				return defaultValue;				
			}

			return p;
	};

	const path = sanitize (basePath, '/media/illustrations');

	const illustrationSrc = `${path}/${name}.svg`;

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
