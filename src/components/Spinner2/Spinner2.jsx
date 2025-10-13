import React from 'react';
import { Row } from 'reactstrap';
import './Spinner2.scss';

export function Spinner2({ color = 'primary', size = 50 }) {
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
						strokeWidth='5'
						strokeMiterlimit='10'
					/>
				</svg>
			</div>
		</Row>
	);
}
