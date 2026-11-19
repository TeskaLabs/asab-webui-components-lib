import React from 'react';
import { useTranslation } from 'react-i18next';

import { getFormattedTimeDuration } from './getFormattedTimeDuration.js';

/*
	Component that displays a duration (delta time in seconds) in a human
	readable form (e.g. "1 h 10 m 5 s") and shows the raw value on hover
*/
export function DateTimeDuration(props) {
	const { t } = useTranslation();

	if (props.value == undefined) {
		return (
			<span className='datetime'>{' '}</span>
		);
	}

	const duration = getFormattedTimeDuration(props.value);

	// Check for invalid value from getFormattedTimeDuration method
	if (duration.duration === 'Invalid value') {
		return (
			<span title={props.value?.toString()} className='datetime text-nowrap'>
				<i className='bi bi-watch pe-1' />
				{t('General|Invalid value')}
			</span>
		);
	}

	return (
		<span
			className='datetime text-nowrap'
			title={duration.value} // Show the raw value (in seconds) on hover
		>
			<i className='bi bi-watch pe-1' />
			{duration.duration}
		</span>
	);
}
