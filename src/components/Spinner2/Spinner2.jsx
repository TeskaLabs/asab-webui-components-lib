import React from 'react';
import { Row } from "reactstrap";

export function Spinner2() {
	return (
		<Row className="loading-spinner-div justify-content-center">
			<div className="suspense-loader spinner-grow text-primary mx-2" role="status">
			</div>
			<div className="suspense-loader spinner-grow text-primary mx-2" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
			<div className="suspense-loader spinner-grow text-primary mx-2" role="status">
			</div>
		</Row>
	);
}
