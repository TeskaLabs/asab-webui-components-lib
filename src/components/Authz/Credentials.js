import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LinkWithAuthz } from './LinkWithAuthz';
import { matchCredentialId } from './utils/fetchAndStoreCredentials';

import './Credentials.scss';

export function Credentials({  app, credentials_ids, apiPath = 'seacat-auth', cleanupTime = 1000 * 60 * 60 * 24 }) {
	// Validation on undefined credentials_ids
	if (credentials_ids == undefined) {
		return '';
	}

	const resources = useSelector(state => state?.auth?.resources);
	const resource = 'seacat:credentials:access'; // Resource required to access the Credentials List Screen

	// Validation on props.app
	if (app == undefined) {
		return renderPlainCredentials(credentials_ids);
	}

	const CredentialsAPI = app.axiosCreate(apiPath);
	const [credential, setCredential] = useState(null);
	// Checks if there is a SeaCatAdminFederationModule
	const hasSeaCatAdminModule = app?.Modules.some((obj) => obj.Name === 'SeaCatAdminFederationModule') === false;

	useEffect(() => {
		// Fallback if credentials_ids sent as an array
		const fallbackCredentialId = Array.isArray(credentials_ids) ? credentials_ids[0] : credentials_ids;
		matchCredentialId(app, fallbackCredentialId, setCredential, cleanupTime, CredentialsAPI);
	}, []);

	function renderPlainCredentials(cred_id) {
		return (
			<div className='authz-credentials-link'>
				<i className='bi bi-person pe-1' />
				<span title={cred_id}>{cred_id}</span>
			</div>
		);
	}

	return (
		<>
			{credential ? (
				<div className='authz-credentials-link' title={credential.username || credential.id}>
					<i className='bi bi-person pe-1' />
					<LinkWithAuthz
						resource={resource}
						resources={resources}
						to={`/auth/credentials/${credential.id}`}
						disabled={hasSeaCatAdminModule}
					>
						{credential.username || credential.id}
					</LinkWithAuthz>
				</div>
			) : (
				<div className='authz-credentials-link' title={credentials_ids}>
					<i className='bi bi-person pe-1'/>
					<LinkWithAuthz
						resource={resource}
						resources={resources}
						to={`/auth/credentials/${credentials_ids}`}
						disabled={hasSeaCatAdminModule}
					>
						{credentials_ids}
					</LinkWithAuthz>
				</div>
			)}
		</>
	);
}
