import React from 'react';
import { Row } from "reactstrap";
import './Spinner2.scss';

export function Spinner2() {
	return (
		<Row className="loading-spinner-div justify-content-center">
			<div class="spinner">
				<svg class="circular" viewBox="25 25 50 50">
					<circle
						class="path"
						cx="50"
						cy="50"
						r="20"
						fill="none"
						stroke-width="5"
						stroke-miterlimit="10"
					/>
				</svg>
			</div>
		</Row>
	);
}
