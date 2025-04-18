import React from 'react';
import { useTranslation } from 'react-i18next';

// Mehod for rendering invalid date component
export function InvalidDate() {
	const { t } = useTranslation();
	return (
		<span className='datetime text-nowrap'>
			<i className='bi bi-clock pe-1' />
			{t('General|Invalid Date')}
		</span>
	);
}
