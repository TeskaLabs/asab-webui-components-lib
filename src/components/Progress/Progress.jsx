import React from 'react';
import { Progress } from 'reactstrap';

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
	progressValue = Math.round(Math.min(Math.max(progressValue, 0), 100)); // Clamp between 0-100 & round to nearest integer

	return (
		<div className="d-flex align-items-center">
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
				<span style={{ width: '2.4rem', textAlign: 'right' }}>
					{progressValue}%
				</span>
			}
		</div>
	)
};
