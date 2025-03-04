import { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { initializeDateFNSLocale, getDateFNSLocale, subscribeToLocaleChange } from './dateFNSLocale';

const useDateFNSLocale = () => {
	const store = useStore();
	initializeDateFNSLocale(store); // Ensure Redux store is initialized once

	const [locale, setLocale] = useState(getDateFNSLocale()); // Store the current locale in state

	useEffect(() => {
		// Subscribe to locale changes
		const unsubscribe = subscribeToLocaleChange(setLocale);

		return () => unsubscribe(); // Cleanup on unmount
	}, []);

	return locale;
};

export default useDateFNSLocale;
