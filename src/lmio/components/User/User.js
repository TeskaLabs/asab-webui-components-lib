import React, { useState, useEffect } from 'react';
import { matchCredentialId } from './utils/fetchAndStoreUser';

/*
	This component displays a username reference.

	Props:
	- app (object, required): The app configuration object containing credential module data.
	- api (object, required): Optional API client used for fetching credential data. Example: api={app.axiosCreate('your-api')}
	- credentials_ids (string, required): One user ID to display or resolve to user information.
	- cleanupTime (number, optional): Time in milliseconds after which cached credentials can be cleared; defaults to 24 hours (1000 * 60 * 60 * 24).
*/

export function User({ app, user_id, api, cleanupTime = 1000 * 60 * 60 * 24 }) {
	// Validation on undefined user_id
	if (user_id == undefined) {
		return '';
	}

	const [user, setUser] = useState(null);

	useEffect(() => {
		matchCredentialId(app, user_id, setUser, cleanupTime, api);
	}, []);

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
