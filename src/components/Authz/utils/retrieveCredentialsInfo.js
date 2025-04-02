import i18next from 'i18next';

// compares array of IDs with data in localstorage
export const matchCredentialId = (app, cred_id, setCredential, cleanupTime) => {
	const usernamesInLS = getUsernamesFromLS('Credentials', cleanupTime);
	if (!usernamesInLS.credentials || usernamesInLS.credentials.length === 0 || usernamesInLS.expiration <= Date.now()) {
		removeUsernamesFromLS();
		retrieveUserName(app, cred_id, setCredential, cleanupTime);
		return;
	}
	const found = usernamesInLS.credentials.find((item) => item.id === cred_id);
	if (!found) {
		retrieveUserName(app, cred_id, setCredential, cleanupTime);
	} else {
		setCredential(found);
	}
};

// asks the server for usernames, saves them to local storage and sets usernames to render
const retrieveUserName = async (app, cred_id, setCredential, cleanupTime,) => {
	const CredentialsAPI = app.axiosCreate('seacat-auth');
	try {
		let response = await CredentialsAPI.put(`idents`, [cred_id]);
		if (response.data.result !== 'OK') {
			throw new Error(i18next.t('General|There was an issue processing a request'));
		}
		const usernameToLS = saveUsernamesToLS(response.data.data, cred_id, cleanupTime);
		setCredential(usernameToLS);
	} catch (e) {
		console.error(e);
		removeUsernamesFromLS();
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

