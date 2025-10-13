import React from 'react';
import { Row } from 'reactstrap';
import './Spinner.scss';

export function Spinner({ color = 'primary', size = 50, strokeWidth = 5 }) {
	// Validate color prop
	const allowedColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
	if (!allowedColors.includes(color)) {
		console.warn(`Spinner: Invalid color "${color}". Allowed colors are: ${allowedColors.join(', ')}`);
		return null;
	};

	const colorClass = `spinner-${color}`;
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
