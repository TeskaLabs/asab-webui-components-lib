import React from 'react';

import { Card, CardBody } from 'reactstrap';

import './ResultCard.scss';


/*
	Status card component that displays content with an appropriate status icon

	Props:
		children: Content to be displayed inside the card
		status: Status type that determines the icon and color (default: 'success')
			- 'success': Green check circle icon
			- 'warning': Orange exclamation circle icon
			- 'dager': Red exclamation triangle icon

	Usage:
		import { ResultCard } from 'asab_webui_components';

		<ResultCard status='success'>
			Operation completed successfully!
		</ResultCard>
		
		<ResultCard status='warning'>
			Warning: Please review the results
		</ResultCard>
		
		<ResultCard status='danger'>
			An error occurred during processing
		</ResultCard>
*/

export function ResultCard({ children, status = 'success' }) {

	const getIconAndColor = () => {
		switch (status) {
			case 'success':
				return 'bi-check-circle-fill text-success';
			case 'warning':
				return 'bi-exclamation-circle-fill text-warning';
			case 'danger':
				return 'bi-exclamation-triangle-fill text-danger';
			default:
				return 'bi-check-circle-fill text-success';
		}
	};

	return (
		<Card className='result-card'>
			<CardBody className='text-center d-flex align-items-center justify-content-center'>
				<div className='justify-content-center pb-2 w-75'>
					<i className={`pe-2 mb-3 fs-1 bi ${getIconAndColor()}`}></i>
					<div>
						{children}
					</div>
				</div>
			</CardBody>
		</Card>
	)
}
