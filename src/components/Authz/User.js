import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { matchCredentialId } from './utils/retrieveCredentialsInfo';

import './Credentials.scss';

export function User ({ ...props }) {

	// Validation on undefined user_id
	if (props.user_id == undefined) {
		return '';
	}

	const { t } = useTranslation();

	const apiPath = props.apiPath ?? 'seacat-auth';

	const CredentialsAPI = props.app.axiosCreate(apiPath);

	const cleanupTime = props.cleanupTime ?? 1000 * 60 * 60 * 24; // 24 hrs

	const [user, setUser] = useState(null);

	useEffect(() => {
		matchCredentialId(props.user_id, setUser, CredentialsAPI, cleanupTime, t);
	}, []);

	return (
		<>
			{user ? (
				<div title={user.username || user.id}>
					<i className='bi bi-person pe-1' />
					<span>{user.username || user.id}</span>
				</div>
			) : (
				<div title={props.user_id}>
					<i className='bi bi-person pe-1'/>
					<span>{props.user_id}</span>
				</div>
			)}
		</>
	);
}
