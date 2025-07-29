import React from 'react';
import { Progress } from 'reactstrap';

import './Progress.scss';

export function ASABProgress({
	// value = 0,
	// color = 'primary',
	animated = true,
	showLabel = true,
	// className = '',
	children,
	...props
}) {
	// Handle both numeric and string values;
	let progressValue;
	let isNumeric = typeof value === 'number';

	if (isNumeric) {
		// Ensure value is a number
		progressValue = Number(value);
		if (!Number.isFinite(progressValue)) {
			progressValue = 0;
		}
		// Clamp between 0-100 & round to nearest integer
		progressValue = Math.round(Math.min(Math.max(progressValue, 0), 100));
	}

	return (
		<div className='d-flex align-items-center'>
			<Progress
				className={`w-100 ${showLabel ? 'me-2' : ''} ${className}`}
				{...props}
				// animated={animated}
				// color={color}
				// value={progressValue}
			>
				{children}
			</Progress>
			{showLabel &&
				<span className='progress-percentage text-end'>
					{progressValue}%
				</span>
			}
		</div>
	);
};
