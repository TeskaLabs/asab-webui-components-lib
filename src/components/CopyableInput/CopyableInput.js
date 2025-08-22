import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Button, Input, InputGroup
} from 'reactstrap';

import './CopyableInput.scss';


/*
	Read-only text area component that displays a value with a copy button

	Props:
		value: Component value to be displayed and copied
		...props: Props to pass to the InputGroup child component
*/
export const CopyableInput = ({ value, ...props }) => {
	const { t } = useTranslation();
	const [valueCopied, setValueCopied] = useState(undefined);

	// Copy the value to clipboard and change the button label for a short time as a visual feedback
	const copyValue = () => {
		if (!value) {
			console.error('No input value to copy.');
			return
		}

		navigator.clipboard.writeText(value)
			.then(() => {
				setValueCopied(true);
				let timeoutId = setTimeout(() => setValueCopied(false), 3000);
				return () => {
					clearTimeout(timeoutId);
				};
			})
			.catch((error) => {
				console.error('Failed to copy input value: ', error);
			});
	};

	return (
		<InputGroup { ...props }>
			<Input 
				readOnly
				value={value}
				type='textarea'
				className='copyable-input'
			/>
			<Button
				outline
				title={t('CopyableInput|Copy to clipboard')}
				color='primary'
				className='text-nowrap'
				onClick={copyValue}
			>
				<i
					className={valueCopied ? 'bi bi-clipboard-check pe-2' : 'bi bi-clipboard pe-2'}
				/>
				{valueCopied
					? t('CopyableInput|Copied!')
					: t('CopyableInput|Copy')
				}
			</Button>
		</InputGroup>
	)
};
