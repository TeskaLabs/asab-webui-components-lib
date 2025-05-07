import i18next from 'i18next';

// Compares array of IDs with data in localstorage
export const matchCredentialId = (app, id, setData, cleanupTime, CredentialsAPI) => {
	const usernamesInLS = _getUsernamesFromLS('Credentials', cleanupTime);
	if (!usernamesInLS.credentials || usernamesInLS.credentials.length === 0 || usernamesInLS.expiration <= Date.now()) {
		_removeUsernamesFromLS();
		_retrieveUserName(app, id, setData, cleanupTime, CredentialsAPI);
		return;
	}
	const found = usernamesInLS.credentials.find((item) => item.id === id);
	if (!found) {
		_retrieveUserName(app, id, setData, cleanupTime, CredentialsAPI);
	} else {
		setData(found);
	}
};

// asks the server for usernames, saves them to local storage and sets usernames to render
const _retrieveUserName = async (app, cred_id, setData, cleanupTime, CredentialsAPI) => {
	try {
		let response = await CredentialsAPI.put(`idents`, [cred_id]);
		if (response.data.result !== 'OK') {
			throw new Error(i18next.t('General|There was an issue processing a request'));
		}
		const usernameToLS = _saveUsernamesToLS(response.data.data, cred_id, cleanupTime);
		setData(usernameToLS);
	} catch (e) {
		console.error(e);
		_removeUsernamesFromLS();
	}
};


function _removeUsernamesFromLS () {
	if (localStorage) {
		localStorage.removeItem('Credentials');
	}
}

// Get usernames from localstorage
function _getUsernamesFromLS (name, cleanupTime) {
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

function _saveUsernamesToLS(data, credentials_id, cleanupTime) {
	if (localStorage) {
		let dataInLS = _getUsernamesFromLS('Credentials', cleanupTime);
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
