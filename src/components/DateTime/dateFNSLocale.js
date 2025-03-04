import cs from 'date-fns/locale/cs'; // (possible exports: af, ar, arDZ, arEG, arMA, arSA, arTN, az, be, beTarask, bg, bn, bs, ca, cs, cy, da, de, deAT, el, enAU, enCA, enGB, enIE, enIN, enNZ, enUS, enZA, eo, es, et, eu, faIR, fi, fr, frCA, frCH, fy, gd, gl, gu, he, hi, hr, ht, hu, hy, id, is, it, itCH, ja, jaHira, ka, kk, km, kn, ko, lb, lt, lv, mk, mn, ms, mt, nb, nl, nlBE, nn, oc, pl, pt, ptBR, ro, ru, sk, sl, sq, sr, srLatn, sv, ta, te, th, tr, ug, uk, uz, uzCyrl, vi, zhCN, zhHK, zhTW)

/*
	To bundle the locales and avoid bundle size issues, we need to define the specific locales used.
	We cant simply use dynamic locales, since asab webui components does not have any node_modules
	and therefore it it cant reach the locale dynamically as it is described here:

	```
		const fetchLocale = async () => {
			// Don't remove comment inside import
			// it's webpack's dynamic expression
			const importedLocale = await import(
				// webpackMode: "lazy", webpackChunkName: "df-[index]"
				`date-fns/locale/${language}/index.js`
			);
			if (isMounted.current === true) setLocale(importedLocale.default);
		}
	```
*/

const availableLocales = { cs };

let storeInstance = null;
let listeners = new Set();

// Function to update the locale when Redux state changes
const updateLocale = () => {
	if (!storeInstance) return;
	const state = storeInstance.getState();
	const newLocale = availableLocales[state.language.current] || undefined;

	// Notify all React components that useDateFNSLocale is watching
	listeners.forEach((callback) => callback(newLocale));
};

// Function to get the current locale
export const getDateFNSLocale = () => {
	if (!storeInstance) return undefined;
	const state = storeInstance.getState();
	return availableLocales[state.language.current] || undefined;
};

// Function to initialize Redux store subscription (called once)
export const initializeDateFNSLocale = (store) => {
	if (storeInstance) return; // Prevent multiple initializations

	storeInstance = store;
	updateLocale(); // Set initial locale on initialization

	// Subscribe to Redux store updates
	store.subscribe(() => {
		updateLocale();
	});
};

// Subscribe React components to locale updates
export const subscribeToLocaleChange = (callback) => {
	listeners.add(callback);
	return () => listeners.delete(callback); // Unsubscribe when component unmounts
};
