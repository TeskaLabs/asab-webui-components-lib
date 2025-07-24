// create reusable progress bar Component, import and reuse one from reactstrap

{/* <ASABProgress bar value={value} color="danger" striped />


<ASABProgress bar value={value} color="danger" striped>
	Honza <<< tohle je child
</ASABProgress>

.........


import react from 'react'; 

export function ASABPRogress({...props, child}) {
	
	return(
		<div class="progress">
  			<div class="progress-bar" role="progressbar" {...props}>{child}</div>
		</div>
	)
} */}
 

	// // TODO: will be replaced by reusable asab-webui component
	// const progressValue = row?.docs_found > 0 
	// ? Math.round((row.docs_processed / row.docs_found) * 100) 
	// : 0;

	// return (
	// 	<div className="d-flex align-items-center">
	// 		<Progress animated color="primary" value={progressValue} className='w-100 me-2'/>
	// 		<span style={{ width: '2.4rem', textAlign: 'right' }}>{progressValue}%</span>
	// 	</div>
	// );

import React from 'react';
import { Progress } from 'reactstrap';

export function ASABProgress({
	color = 'primary',
	showPercentage = true,
	children }) {

	const progressValue = 0; // This should be replaced with actual logic to determine the value

	return (
		<div className="d-flex align-items-center">
			<Progress animated color={color} value={progressValue} className='w-100 me-2'>
				{children}
			</Progress>
			{showPercentage && 
				<span style={{ width: '2.4rem', textAlign: 'right' }}>
					{progressValue}%
				</span>
			}
		</div>
	)
};
