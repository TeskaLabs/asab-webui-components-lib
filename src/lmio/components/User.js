import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';



export function User({ ...props }) {
	return (
		<span>Hello Franta and Ari</span>
	)
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
