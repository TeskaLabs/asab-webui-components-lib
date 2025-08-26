import React, { useState, useRef, useEffect } from 'react';
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

	Usage:
		import { CopyableInput } from 'asab_webui_components';

		const generatedUrl = 'https://example.com/somesecret?token=c29tZXNlY3JldAo';
		...

		<CopyableInput
			value={generatedUrl}
			className='my-2'
		/>
*/
export const CopyableInput = ({ value, ...props }) => {
	const { t } = useTranslation();
	const [valueCopied, setValueCopied] = useState(false);
	const timeoutRef = useRef(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	// Copy the value to clipboard and change the button label for a short time as a visual feedback
	const copyValue = () => {
		if (!value) {
			console.error('No input value to copy.');
			return
		}

		navigator.clipboard.writeText(value)
			.then(() => {
				setValueCopied(true);
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
					timeoutRef.current = setTimeout(() => setValueCopied(false), 3000);
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
				className='asab-copyable-input'
			/>
			<Button
				outline
				title={t('General|Copy to clipboard')}
				color='primary'
				className='text-nowrap border'
				onClick={copyValue}
			>
				<i
					className={valueCopied ? 'bi bi-clipboard-check pe-2' : 'bi bi-clipboard pe-2'}
				/>
				{valueCopied
					? t('General|Copied!')
					: t('General|Copy')
				}
			</Button>
		</InputGroup>
	)
};
