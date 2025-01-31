import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'reactstrap';

/*
	This button toggles fullscreen mode for a component.

	Props:
	- fullscreen (boolean): Indicates the current fullscreen state.
	- setFullscreen (function): Function to toggle the fullscreen state.
*/

export function FullscreenButton ({ fullscreen, setFullscreen}) {
	const { t } = useTranslation();
	return (
		<Button
			outline
			type='button'
			color='primary'
			title={fullscreen ? t('General|Exit Fullscreen') : t('General|Fullscreen')}
			onClick={() => setFullscreen(!fullscreen)}
		>
			<i className={fullscreen ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen'} />
		</Button>
	);
}
