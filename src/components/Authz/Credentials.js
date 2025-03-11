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

	const credentials_ids = Array.isArray(props.credentials_ids) ? props.credentials_ids : [props.credentials_ids];

	// Validation on props.app
	if (props.app == undefined) {
		return renderPlainCredentials(credentials_ids);
	}

	const [credentials, setCredentials] = useState([]);
	// Checks if there is a SeaCatAdminFederationModule
	const hasSeaCatAdminModule = props.app?.Modules.some((obj) => obj.Name === 'SeaCatAdminFederationModule') === false;

	useEffect(() => {
		// Define an asynchronous function to fetch credentials
		const fetchCredentials = async () => {
			// Call the function and get the credentials object with id and username fields
			const result = await credentialsToString(props.credentials_ids, props.app, t);
			setCredentials(result);
		};

		// Call the fetchCredentials function to load credentials data
		fetchCredentials();
	}, []);

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

// Function gets username from id. Returns an array of objects with 'id' and 'username' fields.
export const credentialsToString = async (credentials_ids, app, t, cleanupTime = 1000 * 60 * 60 * 24) => {
	// If credentials_ids is empty or null, return an empty array.
	if (!credentials_ids) return [];

	// Ensure credentials_ids is an array. If it's a single value, wrap it into an array.
	const idsArray = Array.isArray(credentials_ids) ? credentials_ids : [credentials_ids];

	// Get cached usernames from localStorage with expiration check.
	const usernamesInLS = getUsernamesFromLS('Credentials', cleanupTime);

	// Initialize an array for usernames we will return.
	let usernamesToRender = [];
	// Initialize an array to store IDs that are not found in localStorage.
	let missingIds = [];

	// Check if there are any cached credentials and if cache is still valid (not expired).
	if (!usernamesInLS.credentials || usernamesInLS.credentials.length === 0 || usernamesInLS.expiration <= Date.now()) {
		// If no valid cache, clear localStorage and mark all IDs as missing.
		removeUsernamesFromLS();
		missingIds = idsArray;
	} else {
		// Iterate over requested IDs to see which ones are cached.
		for (const id of idsArray) {
			// Try to find the credential in cached data.
			const found = usernamesInLS.credentials.find(cred => cred.id === id);
			if (found) {
				// If found, add it to the result array.
				usernamesToRender.push({ username: found.username, id: found.id });
			} else {
				// If not found, mark this ID as missing.
				missingIds.push(id);
			}
		}
	}

	// If all requested IDs are found in cache, return them immediately.
	if (missingIds.length === 0) {
		return usernamesToRender;
	}

	try {
		// If app instance is not provided, throw an error (because it's required for API call).
		if (!app) throw new Error('App instance is required to fetch credentials');

		// Create axios instance for 'seacat-auth' service.
		const CredentialsAPI = app.axiosCreate('seacat-auth');

		// Fetch credentials data for missing IDs using PUT request.
		const response = await CredentialsAPI.put('idents', missingIds);

		if (response.data.result !== 'OK') {
			throw new Error(t('General|There was an issue processing a request'));
		}

		// Save fetched credentials into localStorage for future usage.
		const fetchedCredentials = saveUsernamesToLS(response.data.data, missingIds, cleanupTime);

		// Combine cached and newly fetched credentials into the final result.
		usernamesToRender = [...usernamesToRender, ...fetchedCredentials.map(cred => ({
			username: cred.username,
			id: cred.id
		}))];

		// Return the combined array of credentials.
		return usernamesToRender;
	} catch (error) {
		console.error(error);
		// Clear localStorage to avoid using potentially corrupted data.
		removeUsernamesFromLS();
		// Return whatever usernames were found in cache (could be empty).
		return usernamesToRender;
	}
};

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
