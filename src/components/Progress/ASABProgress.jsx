import React from 'react';
import { Progress } from 'reactstrap';

import './ASABProgress.scss';

export function ASABProgress({
	showLabel = true,
	children,
	...props
}) {
	// Value has to be present and numeric
	let progressValue = props?.value;

	// Early return if not a number
	if (!(typeof progressValue === 'number')) {
		console.warn('ASABProgress not rendered due to an invalid value');
		return null;
	}

	// Handle non-finite numbers (Infinity, -Infinity, NaN)
	if (!Number.isFinite(progressValue)) {
		progressValue = 0;
	}

	// Clamp between 0-100 & round to nearest integer
	progressValue = Math.round(Math.min(Math.max(progressValue, 0), 100));

	return (
		<div className='d-flex align-items-center'>
			<Progress
				{...props}
				className={`w-100 ${showLabel ? 'me-2' : ''} ${props.className || ''}`}
				value={progressValue}
			>
				{children}
			</Progress>
			{showLabel
				&& <span className='asab-progress-percentage text-end'>
					{`${progressValue}%`}
				</span>
			}
		</div>
	);
}
