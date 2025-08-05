import React, { useState } from 'react';

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
		?.toLowerCase(); // Normalize to lowercase

	if (!sanitizedName) {
		console.warn(`Invalid or empty illustration name: '${name}'`);
		return null;
	}	

	const illustrationSrc = `${basePath}/${sanitizedName}.svg`;

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
