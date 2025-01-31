import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'reactstrap';
import { useConsoleContext } from '../ConsoleContext.jsx';

// This is a button component that, when clicked, sends through a Context state that allows you to add styles for wrapping lines in the console
export function ConsoleModeButton () {
	const { t } = useTranslation();
	const { isContentWrapped, setIsContentWrapped } = useConsoleContext();

	const handleWrapToggle = (state) => {
		setIsContentWrapped(state);
	};

	return (
		<Button
			outline
			type='button'
			color='primary'
			active={isContentWrapped}
			title={isContentWrapped ? t('Console|Unwrap lines') : t('Console|Wrap lines')}
			onClick={(e) => {
				e.preventDefault();
				handleWrapToggle(!isContentWrapped);
			}}
		>
			<i className='bi bi-text-wrap' />
		</Button>
	);
}
