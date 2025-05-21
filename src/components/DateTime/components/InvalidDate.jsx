import React from 'react';
import { useTranslation } from 'react-i18next';

// Mehod for rendering invalid date component
export function InvalidDate({ value }) {
	const { t } = useTranslation();
	return (
		<span title={value?.toString()} className='datetime text-nowrap'>
			<i className='bi bi-clock pe-1' />
			{t('General|Invalid Date')}
		</span>
	);
}
