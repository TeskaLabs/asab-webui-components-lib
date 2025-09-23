import React, { useState, useEffect } from 'react';
import { LinkWithAuthz } from '../LinkWithAuthz';
import { matchCredentialId } from '../../utils/fetchAndStoreCredentials';

import './Credentials.scss';

/*
	This component displays a credential reference and links to their details page if available.

	Props:
	- app (object, required): The app configuration object containing credential module data.
	- credentials_id (string or array, required): One or more credential IDs to display or resolve to user information.
	- cleanupTime (number, optional): Time in milliseconds after which cached credentials can be cleared; defaults to 24 hours (1000 * 60 * 60 * 24).
	- disableNavigation (boolean, optional): If true, renders as plain text without navigation links; defaults to false.
*/

export function Credentials({ app, credentials_id, cleanupTime = 1000 * 60 * 60 * 24, disableNavigation = false }) {

	// Validation on undefined credentials_id
	if (credentials_id == undefined) {
		return '';
	}

	const resources = app.AppStore?.getState()?.auth?.resources || [];
	const resource = 'seacat:credentials:access'; // Resource required to access the Credentials List Screen

	// Validation on props.app
	if (app == undefined) {
		return renderPlainCredentials(credentials_id);
	}

	const [credential, setCredential] = useState(null);
	// Checks if there is a SeaCatAdminFederationModule
	const hasSeaCatAdminModule = app?.Modules.some((obj) => obj.Name === 'SeaCatAdminFederationModule') === false;

	useEffect(() => {
		// Fallback if credentials_id sent as an array
		const fallbackCredentialId = Array.isArray(credentials_id) ? credentials_id[0] : credentials_id;
		matchCredentialId(app, fallbackCredentialId, setCredential, cleanupTime);
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
					{disableNavigation ? (
						<span>{credential.username || credential.id}</span>
					) : (
						<LinkWithAuthz
							resource={resource}
							resources={resources}
							to={`/auth/credentials/${credential.id}`}
							disabled={hasSeaCatAdminModule}
						>
							{credential.username || credential.id}
						</LinkWithAuthz>
					)}
				</div>
			) : (
				<div className='authz-credentials-link' title={credentials_id}>
					<i className='bi bi-person pe-1'/>
					{disableNavigation ? (
						<span>{credentials_id}</span>
					) : (
						<LinkWithAuthz
							resource={resource}
							resources={resources}
							to={`/auth/credentials/${credentials_id}`}
							disabled={hasSeaCatAdminModule}
						>
							{credentials_id}
						</LinkWithAuthz>
					)}
				</div>
			)}
		</>
	);
}
