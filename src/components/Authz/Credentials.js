import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LinkWithAuthz } from './LinkWithAuthz';
import { matchCredentialId } from './utils/fetchAndStoreCredentials';

import './Credentials.scss';

/*
	This component displays a credential reference and links to their details page if available.

	Props:
	- app (object, required): The app configuration object containing credential module data.
	- api (object, required): API client used for fetching credential data. Example: api={app.axiosCreate('your-api')}
	- credentials_ids (string or array, required): One or more credential IDs to display or resolve to user information.
	- cleanupTime (number, optional): Time in milliseconds after which cached credentials can be cleared; defaults to 24 hours (1000 * 60 * 60 * 24).
*/

export function Credentials({ app, credentials_ids, api, cleanupTime = 1000 * 60 * 60 * 24 }) {
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

	const [credential, setCredential] = useState(null);
	// Checks if there is a SeaCatAdminFederationModule
	const hasSeaCatAdminModule = app?.Modules.some((obj) => obj.Name === 'SeaCatAdminFederationModule') === false;

	useEffect(() => {
		// Fallback if credentials_ids sent as an array
		const fallbackCredentialId = Array.isArray(credentials_ids) ? credentials_ids[0] : credentials_ids;
		matchCredentialId(app, fallbackCredentialId, setCredential, cleanupTime, api);
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
