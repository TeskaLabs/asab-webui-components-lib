import React from 'react';
import { Row } from "reactstrap";

import './Spinner.scss';

/*
	Animated loading spinner component

	Usage:
		import { Spinner } from 'asab_webui_components';

		<Spinner />
*/

export function Spinner() {
	
	return (
		<Row className='overflow-hidden'>
			<div className='asab-spinner' role='status' aria-label='Loading'>
				<svg className='asab-spinner circular h-100 w-100' viewBox='25 25 50 50'>
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
