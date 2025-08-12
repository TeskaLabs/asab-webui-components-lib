import React from 'react';

import { Card, CardBody } from 'reactstrap';

import './ResultCard.scss';

export function ResultCard({ body, status = 'success' }) {

	const getIconAndColor = () => {
		switch (status) {
			case 'success':
				return 'bi-check-circle-fill text-success';
			case 'warning':
				return 'bi-cone-striped text-warning';
			case 'error':
				return 'bi-exclamation-triangle-fill text-danger';
			default:
				return 'bi-check-circle-fill text-success';
		}
	};

	return (
		<Card className='result-card'>
			<CardBody className='text-center d-flex align-items-center justify-content-center'>
				<div className='justify-content-center pb-2'>
					<i className={`pe-2 mb-3 fs-1 bi ${getIconAndColor()}`}></i>
					<div>
						{body}
					</div>
				</div>
			</CardBody>
		</Card>
	)
}
