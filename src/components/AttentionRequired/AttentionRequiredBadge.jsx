import React from 'react';
import { Badge } from 'reactstrap';

// Component for Attention badge rendereing
export function AttentionBadge({ content, ...props }) {
	const level = content?.level || 'danger';

	return(
		<Badge
			className='attention-required-badge'
			color={level}
			{...props} // Spread the additional props like onClick, etc.
		>
			{content?.count}
		</Badge>
	)
}
