import React from 'react';
import { Progress } from 'reactstrap';

import './Progress.scss';

export function ASABProgress({
	value = 0,
	color = 'primary',
	animated = true,
	showPercentage = true,
	className = '',
	children,
	...props
}) {
	// Ensure value is a number
	let progressValue = Number(value);
	if (!Number.isFinite(progressValue)) {
		progressValue = 0;
	}
	// Clamp between 0-100 & round to nearest integer
	progressValue = Math.round(Math.min(Math.max(progressValue, 0), 100));

	return (
		<div className='d-flex align-items-center'>
			<Progress
				animated={animated}
				color={color}
				value={progressValue}
				className={`w-100 ${showPercentage && 'me-2'} ${className}`}
				{...props}
			>
				{children}
			</Progress>
			{showPercentage &&
				<span className='progress-percentage text-end'>
					{progressValue}%
				</span>
			}
		</div>
	)
};
