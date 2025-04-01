import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { LinkWithAuthz } from './LinkWithAuthz';

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
		matchCredentialId(props.credentials_ids);
	}, []);

	// asks the server for usernames, saves them to local storage and sets usernames to render
	const retrieveUserName = async () => {
		try {
			let response = await CredentialsAPI.put(`idents`, [props.credentials_ids]);
			if (response.data.result !== 'OK') {
				throw new Error(t('General|There was an issue processing a request'));
			}
			const usernameToLS = saveUsernamesToLS(response.data.data, props.credentials_ids, cleanupTime);
			setCredential(usernameToLS);
		} catch (e) {
			console.error(e);
			removeUsernamesFromLS();
		}
	};

	// compares array of IDs with data in localstorage
	const matchCredentialId = (cred_id) => {
		const usernamesInLS = getUsernamesFromLS('Credentials', cleanupTime);
		if (!usernamesInLS.credentials || usernamesInLS.credentials.length === 0 || usernamesInLS.expiration <= Date.now()) {
			removeUsernamesFromLS();
			retrieveUserName();
			return;
		}
		const found = usernamesInLS.credentials.find((item) => item.id === cred_id);
		if (!found) {
			retrieveUserName();
		} else {
			console.log(found, 'found')
			setCredential(found);
		}
	};

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

function removeUsernamesFromLS () {
	if (localStorage) {
		localStorage.removeItem('Credentials');
	}
}

// Get usernames from localstorage
function getUsernamesFromLS (name, cleanupTime) {
	let ls;
	if (localStorage) {
		try {
			ls = JSON.parse(localStorage.getItem(name.toString()));
		} catch (e) {
			/*Ignore*/
		}
	}
	return ls ? ls : { credentials: [], expiration: Date.now() + cleanupTime };
}

function saveUsernamesToLS(data, credentials_id, cleanupTime) {
	if (localStorage) {
		let dataInLS = getUsernamesFromLS('Credentials', cleanupTime);
		let item = {
			id: credentials_id,
			username: data[credentials_id] || undefined,
		};
		if (!dataInLS.credentials.find((cred) => cred.id === item.id)) {
			dataInLS.credentials.push(item);
		}
		localStorage.setItem('Credentials', JSON.stringify(dataInLS));
		return item;
	}
}
