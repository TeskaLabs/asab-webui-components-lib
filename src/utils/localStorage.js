/*
	Reusable utils for saving, getting and removing LocalStorage content.

	`params` property is optional

	Example of usage:

	- Save:
		saveToLS("My Storage key", "My URL params", "filter=abc&size=99");
		saveToLS("My Other key", "123 abc");
	- Get:
		getFromLS("My Storage key");
	- Remove:
		removeFromLS("My Storage key");
*/

// Save pathname and params to localstorage
export function saveToLS(key, entry, params) {
	if (global.localStorage) {
		if (params) {
			// For pathname save to LS
			global.localStorage.setItem(
			key.toString(),
			JSON.stringify({
				[entry]: params
				})
			);
		} else {
			// For favourite fields save to LS
			global.localStorage.setItem(
			key.toString(),
			JSON.stringify(entry)
			);
		}
	}
}

// Get pathname and params from localstorage
export function getFromLS(key, entry) {
	let ls = {};
	if (global.localStorage) {
		try {
			ls = JSON.parse(global.localStorage.getItem(key?.toString())) || {};
		} catch (e) {
		/*Ignore*/
		}
		if (entry) {
			ls = ls[entry] ? ls[entry] : {};
		}
	}
	return ls;
}

// Remove item from localstorage
export function removeFromLS(key) {
	if (global.localStorage) {
		try {
			global.localStorage.removeItem(key.toString());
		} catch (e) {
		/*Ignore*/
		}
	}
}
