import React from 'react';
import './Spinner.scss';

/*
	Animated loading spinner component

	Usage:
		import { Spinner } from 'asab_webui_components';

		<Spinner />
*/

export const Spinner = React.memo(function Spinner() {
	return (
		<div className='asab-spinner d-flex justify-content-center w-100 overflow-hidden' role='status' aria-label='Loading'>
			<div className='asab-spinner-container'>
				<div className='asab-spinner-layer'>
					<div className='asab-spinner-clipper asab-spinner-clipper-left' />
					<div className='asab-spinner-gap' />
					<div className='asab-spinner-clipper asab-spinner-clipper-right' />
				</div>
			</div>
		</div>
	);
});
