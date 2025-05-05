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
			setUser(usernamesToLS);
		} catch (e) {
			console.error(e);
			removeUsernamesFromLS();
		}
	}

	// compares array of IDs with data in localstorage
	const matchCredentialIds = (id) => {
		const usernamesInLS = getUsernamesFromLS('Users', cleanupTime);
		let usernamesToRender = [];
		if (usernamesInLS.users == undefined || usernamesInLS.users.length === 0 || usernamesInLS.expiration <= Date.now()) {
			removeUsernamesFromLS();
			retrieveUserNames();
			return;
		}
		for (let i = 0; i < id.length; i++) {
			const indexFromLS = usernamesInLS.users.findIndex((itemInLS) => itemInLS.id === id[i]);
			if (indexFromLS === -1) {
				retrieveUserNames();
				return;
			}
			usernamesToRender.push({ username: usernamesInLS.users[indexFromLS].username, id: usernamesInLS.users[indexFromLS].id });
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
		localStorage.removeItem('Users');
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
	return ls ? ls : { users: [], expiration: Date.now() + cleanupTime };
}

function saveUsernamesToLS (data, ids, cleanupTime) {
	if (localStorage) {
		let dataInLS = getUsernamesFromLS('Users', cleanupTime);
		let dataToLS = [];
		ids.map((id) => {
			let item = {};
			if (data[id]) {
				item = {
					id: id,
					username: data[id],
				};
			}
			if (!data[id]) {
				item = {
					id: id,
					username: undefined
				}
			}
			const indexFromLS = dataInLS.users.findIndex((itemInLS) => itemInLS.id === item.id);
			if (indexFromLS === -1) {
				dataInLS.users.push(item);
			}
			dataToLS.push(item);
		})
		localStorage.setItem('Users', JSON.stringify(dataInLS));
		return dataToLS;
	}
}
