import React from 'react';
import { Progress } from 'reactstrap';

import './ASABProgress.scss';

export function ASABProgress({
	showLabel = true,
	children,
	...props
}) {
	// Handle both numeric and string values;
	let progressValue;
	let isNumeric = typeof props.value === 'number';

	// Return null if value is no a number or string
	if (!isNumeric && typeof props.value !== 'string') {
		return null;
	}

	if (isNumeric) {
		// Ensure value is a number
		progressValue = Number(props.value);
		if (!Number.isFinite(progressValue)) {
			progressValue = 0;
		}
		// Clamp between 0-100 & round to nearest integer
		progressValue = Math.round(Math.min(Math.max(progressValue, 0), 100));
	} else {
		// For strings, show indeterminate progress
		progressValue = 100;
	}

	console.log('ASABProgress', {
		value: props.value,
		progressValue,
		isNumeric,
	});

	return (
		<div className='d-flex align-items-center'>
			<Progress
				className={`w-100 ${showLabel ? 'me-2' : ''} ${props.className}`}
				{...props}
				value={progressValue}
			>
				{children}
			</Progress>
			{showLabel &&
				<span className='asab-progress-percentage text-end'>
					{isNumeric ? `${progressValue}%` : props.value}
				</span>
			}
		</div>
	);
};
