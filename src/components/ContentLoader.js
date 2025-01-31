import React from 'react';

export function ChartLoader({ title = undefined, customClass = '' }) {
	
	let windowWidth = window.innerWidth;
	
	//calculating window size to make sure rectangles fill width
	let rectangles = new Array(Math.floor(windowWidth / 10)).fill(1);

	return (
		<div className={`${customClass} d-flex h-100 align-items-end overflow-hidden placeholder-glow`}>
			{rectangles.map((_, i) => {
				const randomHeight = Math.floor(Math.random() * 81) + 10; //generate a height between 10% and 90%
					return (
						<span
							title={title}
							className="placeholder col-12 my-0 mx-1"
							key={i}
							style={{
								width: 12,
								height: `${randomHeight}%`,
								backgroundColor: "#E4E5E6"
							}}
						/>
					)
			})}
		</div>
	);
}

export function CellContentLoader({ rows = 10, title = undefined, customClass = '' }) {

	let rectangles = new Array(rows).fill(1);

	return (
		<div className={`${customClass} placeholder-glow`}> {/* Allow user to add custom styling */}
			{rectangles.map((_, i) =>(
				<span
					title={title}
					className="placeholder col-12 d-inline-block"
					key={i}
					style={{
						height: 12,
						backgroundColor: "#E4E5E6"
					}}
				/>
			))}
		</div>
	);
};
