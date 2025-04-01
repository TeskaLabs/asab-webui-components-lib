import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { matchCredentialId } from './utils/retrieveCredentialsInfo';

import './Credentials.scss';

export function User ({ ...props }) {

	// Validation on undefined credentials_ids
	if (props.credentials_ids == undefined) {
		return '';
	}

	const { t } = useTranslation();

	const apiPath = props.apiPath ?? 'seacat-auth';

	const CredentialsAPI = props.app.axiosCreate(apiPath);

	const cleanupTime = props.cleanupTime ?? 1000 * 60 * 60 * 24; // 24 hrs

	const [credential, setCredential] = useState(null);

	useEffect(() => {
		matchCredentialId(props.credentials_ids, setCredential, CredentialsAPI, cleanupTime, t);
	}, []);

	return (
		<>
			{credential ? (
				<div title={credential.username || credential.id}>
					<i className='bi bi-person pe-1' />
					<span>{credential.username || credential.id}</span>
				</div>
			) : (
				<div title={props.credentials_ids}>
					<i className='bi bi-person pe-1'/>
					<span>{props.credentials_ids}</span>
				</div>
			)}
		</>
	);
}
