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

	const credentials_ids = Array.isArray(props.credentials_ids) ? props.credentials_ids : [props.credentials_ids];

	// Validation on props.app
	if (props.app == undefined) {
		return renderPlainCredentials(credentials_ids);
	}

	const CredentialsAPI = props.app.axiosCreate(apiPath);

	const cleanupTime = props.cleanupTime ?? 1000 * 60 * 60 * 24; // 24 hrs

	const [credentials, setCredentials] = useState([]);
	// Checks if there is a SeaCatAdminFederationModule
	const hasSeaCatAdminModule = props.app?.Modules.some((obj) => obj.Name === 'SeaCatAdminFederationModule') === false;

	useEffect(() => {
		matchCredentialIds(credentials_ids);
	}, []);

	// asks the server for usernames, saves them to local storage and sets usernames to render
	const retrieveUserNames = async () => {
		try {
			let response = await CredentialsAPI.put(`idents`, credentials_ids);
			if (response.data.result !== 'OK') {
				throw new Error(t('General|There was an issue processing a request'));
			}
			const usernamesToLS = saveUsernamesToLS(response.data.data, credentials_ids, cleanupTime);
			setCredentials(usernamesToLS);
		} catch (e) {
			console.error(e);
			removeUsernamesFromLS();
		}
	}

	// compares array of IDs with data in localstorage
	const matchCredentialIds = (credentials_ids) => {
		const usernamesInLS = getUsernamesFromLS('Credentials', cleanupTime);
		let usernamesToRender = [];
		if (usernamesInLS.credentials == undefined || usernamesInLS.credentials.length === 0 || usernamesInLS.expiration <= Date.now()) {
			removeUsernamesFromLS();
			retrieveUserNames();
			return;
		}
		for (let i = 0; i < credentials_ids.length; i++) {
			const indexFromLS = usernamesInLS.credentials.findIndex((itemInLS) => itemInLS.id === credentials_ids[i]);
			if (indexFromLS === -1) {
				retrieveUserNames();
				return;
			}
			usernamesToRender.push({ username: usernamesInLS.credentials[indexFromLS].username, id: usernamesInLS.credentials[indexFromLS].id });
		}
		setCredentials(usernamesToRender);
	}
	function renderPlainCredentials (credentials_ids) {
		return credentials_ids.map((credentials_id, i) => (
			<div className='authz-credentials-link' key={i}>
				<i className='bi bi-person pe-1' />
				<span title={credentials_id}>{credentials_id}</span>
			</div>
		))
	}

	return (
		<>
			{credentials && (credentials.length !== 0) ?
				credentials.map((credentialObj, i) => (
					<div key={i} className='authz-credentials-link' title={credentialObj.username || credentialObj.id}>
						<i className='bi bi-person pe-1' />
						<LinkWithAuthz
							resource={resource}
							resources={resources}
							to={`/auth/credentials/${credentialObj.id}`}
							disabled={hasSeaCatAdminModule}
						>
							{credentialObj.username || credentialObj.id}
						</LinkWithAuthz>
					</div>
				))
				:
				credentials_ids.map((credentials_id, i) => (
					<div key={i} className='authz-credentials-link' title={credentials_id}>
						<i className='bi bi-person pe-1' />
						<LinkWithAuthz
							resource={resource}
							resources={resources}
							to={`/auth/credentials/${credentials_id}`}
							disabled={hasSeaCatAdminModule}
						>
							{credentials_id}
						</LinkWithAuthz>
					</div>
				))
			}
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

function saveUsernamesToLS (data, credentials_ids, cleanupTime) {
	if (localStorage) {
		let dataInLS = getUsernamesFromLS('Credentials', cleanupTime);
		let dataToLS = [];
		credentials_ids.map((credential_id) => {
			let item = {};
			if (data[credential_id]) {
				item = {
					id: credential_id,
					username: data[credential_id],
				};
			}
			if (!data[credential_id]) {
				item = {
					id: credential_id,
					username: undefined
				}
			}
			const indexFromLS = dataInLS.credentials.findIndex((itemInLS) => itemInLS.id === item.id);
			if (indexFromLS === -1) {
				dataInLS.credentials.push(item);
			}
			dataToLS.push(item);
		})
		localStorage.setItem('Credentials', JSON.stringify(dataInLS));
		return dataToLS;
	}
}
