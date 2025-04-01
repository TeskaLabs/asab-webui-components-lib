import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import './Credentials.scss';

export function Credentials({ ...props }) {

	// Validation on undefined credentials_ids
	if (props.credentials_ids == undefined) {
		return '';
	}

	const { t } = useTranslation();

	const apiPath = props.apiPath ?? 'seacat-auth';

	// Validation on props.app
	if (props.app == undefined) {
		return renderPlainCredentials(props.credentials_ids);
	}

	const CredentialsAPI = props.app.axiosCreate(apiPath);

	const cleanupTime = props.cleanupTime ?? 1000 * 60 * 60 * 24; // 24 hrs

	const [credential, setCredential] = useState(null);

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
