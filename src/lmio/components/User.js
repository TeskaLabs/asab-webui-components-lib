import React, { useState, useEffect } from 'react';
import { _matchCredentialId } from "../../utils/retrieveCredentialsInfo";

export function User({ app, user_id, apiPath = 'seacat-auth', cleanupTime = 1000 * 60 * 60 * 24 }) {
	// Validation on undefined user_id
	if (user_id == undefined) {
		return '';
	}

	const CredentialsAPI = app.axiosCreate(apiPath);
	const [user, setUser] = useState(null);

	useEffect(() => {
		_matchCredentialId(app, user_id, setUser, cleanupTime, CredentialsAPI);
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
