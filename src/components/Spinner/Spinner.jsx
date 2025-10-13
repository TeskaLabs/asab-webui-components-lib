import React from 'react';
import { Row } from 'reactstrap';
import './Spinner.scss';

/*
	Animated loading spinner component with customizable appearance

	Props:
		color: Bootstrap color variant for the spinner (default: 'primary')
		(Allowed colors: primary, secondary, success, danger, warning, info, light, dark)
		size: Width and height of the spinner in pixels (default: 50)
			- Number: Any positive number (e.g., 30, 50, 100)
		strokeWidth: Thickness of the spinner stroke in pixels (default: 5)
			- Number: Stroke thickness (e.g., 3, 5, 8)

	Usage:
		import { Spinner } from 'asab_webui_components';

		// Basic usage
		<Spinner />
		
		// Or with optional props
		<Spinner color='success' size={75} strokeWidth={8} />
*/

export function Spinner({ color = 'primary', size = 50, strokeWidth = 5 }) {
	// Validate color prop
	const allowedColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
	let validatedColor = color;
	if (!allowedColors.includes(color)) {
		console.warn(`Spinner: Invalid color "${color}". Allowed colors are: ${allowedColors.join(', ')}`);
		validatedColor = 'primary';
	};

	const colorClass = `spinner-${validatedColor}`;
	const sizeStyle = { width: `${size}px`, height: `${size}px` };
	
	return (
		<Row className='loading-spinner-div justify-content-center'>
			<div className={`spinner ${colorClass}`} style={sizeStyle}>
				<svg className='circular' viewBox='25 25 50 50'>
					<circle
						className='path'
						cx='50'
						cy='50'
						r='20'
						fill='none'
						strokeWidth={strokeWidth}
						strokeMiterlimit='10'
					/>
				</svg>
			</div>
		</Row>
	);
}
