import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { LinkWithAuthz } from './LinkWithAuthz';
import { matchCredentialId } from './utils/retrieveCredentialsInfo';

import './Credentials.scss';

export function Credentials({ ...props }) {

	// Validation on undefined credentials_ids
	if (props.credentials_ids == undefined) {
		return '';
	}

	const resources = useSelector(state => state?.auth?.resources);
	const resource = 'seacat:credentials:access'; // Resource required to access the Credentials List Screen

	const { t } = useTranslation();

	const apiPath = props.apiPath ?? 'seacat-auth';

	// Validation on props.app
	if (props.app == undefined) {
		return renderPlainCredentials(props.credentials_ids);
	}

	const CredentialsAPI = props.app.axiosCreate(apiPath);

	const cleanupTime = props.cleanupTime ?? 1000 * 60 * 60 * 24; // 24 hrs

	const [credential, setCredential] = useState(null);
	// Checks if there is a SeaCatAdminFederationModule
	const hasSeaCatAdminModule = props.app?.Modules.some((obj) => obj.Name === 'SeaCatAdminFederationModule') === false;

	useEffect(() => {
		matchCredentialId(props.credentials_ids, setCredential, CredentialsAPI, cleanupTime, t);
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
				<div className='authz-credentials-link' title={props.credentials_ids}>
					<i className='bi bi-person pe-1'/>
					<LinkWithAuthz
						resource={resource}
						resources={resources}
						to={`/auth/credentials/${props.credentials_ids}`}
						disabled={hasSeaCatAdminModule}
					>
						{props.credentials_ids}
					</LinkWithAuthz>
				</div>
			)}
		</>
	);
}
