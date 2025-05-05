import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function User({ app, user_id, apiPath = 'seacat-auth', cleanupTime = 1000 * 60 * 60 * 24 }) {

	// Validation on undefined user_id
	if (user_id == undefined) {
		return '';
	}

	const { t } = useTranslation();

	const CredentialsAPI = app.axiosCreate(apiPath);

	const [user, setUser] = useState([]);

	useEffect(() => {
		matchCredentialIds(user_id);
	}, []);

	// asks the server for usernames, saves them to local storage and sets usernames to render
	const retrieveUserNames = async () => {
		try {
			let response = await CredentialsAPI.put(`idents`, [user_id]);
			if (response.data.result !== 'OK') {
				throw new Error(t('General|There was an issue processing a request'));
			}
			const usernamesToLS = saveUsernamesToLS(response.data.data, user_id, cleanupTime);
			console.log(usernamesToLS, 'lalal')
			setUser(usernamesToLS);
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
		setUser(usernamesToRender);
	}

	return (
		<>
			{user ? (
				<div title={user.username || user.id} className='authz-user'>
					<i className='bi bi-person pe-1' />
					<span>{user.username || user.id}</span>
				</div>
			) : (
				<div title={user_id} className='authz-user'>
					<i className='bi bi-person pe-1'/>
					<span>{user_id}</span>
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