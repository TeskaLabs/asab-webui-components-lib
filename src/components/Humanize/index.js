import React from 'react';
import humanizeToString from './humanizeToString';

export function Humanize({ value, base = 1000, decimals = 0, displaySizes = false, unit = undefined }) {

	const title = unit ? value+' '+unit : value;

	const h = humanizeToString({ value, base, decimals, displaySizes, unit });

	return (
		<span className="humanize" title={title}>
			{h}
		</span>
	)
}
