import React from 'react';

export const FlowbiteIllustration = ({
	name,
	className = '', 
	width = '300px',
	height = 'auto',
	title = '',
	basePath = '/media/illustrations',
}) => {
	// Sanitize the name to prevent path traversal and ensure valid filename
	const sanitizedName = name
		?.replace(/[^a-zA-Z0-9\-_]/g, '') // Only allow alphanumeric, hyphens, underscores
		?.toLowerCase(); // Normalize to lowercase

if (!sanitizedName) {
	console.warn(`Invalid or empty illustration name: '${name}'`);
	return null;
}	

	const illustrationSrc = `${basePath}/${sanitizedName}.svg`;

	return (
		<div className='text-center'>
			<img 
				src={illustrationSrc}
				alt={title || `${name} illustration`}
				title={title}
				className={className}
				style={{ 
					width, 
					height,
					maxWidth: '100%',
				}}
				onError={(e) => {
					console.warn(`Illustration '${name}' failed to load from ${illustrationSrc}`);
					e.target.style.display = 'none';
				}}
			/>
		</div>
	);
};
