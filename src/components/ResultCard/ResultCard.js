import React from 'react';

import { Card, CardBody } from 'reactstrap';

import './ResultCard.scss';

export function ResultCard({ body, isSuccessful = true }) {

	return (
		<Card className='result-card'>
			<CardBody className='text-center d-flex align-items-center justify-content-center'>
				<div className='justify-content-center'>
					<i className={`pe-2 mb-3 fs-1 bi ${(isSuccessful == true) ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'}`}></i>
					<div>
						{body}
					</div>
				</div>
			</CardBody>
		</Card>
	)
}
