/*
	Backlink utility for storing and retrieving navigation back URLs
	Uses sessionStorage to persist backlink data across page navigations

	Example:

	Storing a backlink before navigation
	```setBacklink('SomeScreen', location.pathname, searchParams.toString());```

	Or using the location helper (searchParams is optional)
	```setBacklinkFromLocation('SomeScreen', location, searchParams);```

	Or store pathname only:
	```setBacklinkFromLocation('SomeScreen', location);```

	Consuming a backlink on component mount (one-time read, React Strict Mode safe)
	```
	useEffect(() => {
		const url = consumeBacklink('SomeScreen');
		if (url) setBacklinkState(url);
	}, []);
	```
*/

const STORAGE_PREFIX = 'backlink:';

/*
	Validates that a URL is safe for internal navigation
	Rejects external URLs and protocol-relative URLs to prevent open redirect attacks
	@param {string} url - The URL to validate
	@returns {boolean} True if the URL is a safe internal path
*/
function isSafeInternalPath(url) {
	return typeof url === 'string' &&
		url.startsWith('/') &&
		!url.startsWith('//');
}

/*
	Normalizes a search/query string by stripping leading '?' characters
	@param {string} search - The search string to normalize
	@returns {string} Normalized search string without leading '?'
 */
function normalizeSearch(search = '') {
	if (!search) return '';
	return search.replace(/^\?+/, '');
}

/*
	Safely executes a sessionStorage operation with error handling
	@param {Function} operation - The sessionStorage operation to perform
	@param {string} context - Description of the operation for error logging
*/
function safeStorageOperation(operation, context) {
	try {
		return operation();
	} catch (error) {
		// Fail silently in private mode or when storage is disabled
		if (error.name === 'QuotaExceededError' || error.name === 'SecurityError') {
			console.warn(`backlink: ${context} failed - storage may be disabled or quota exceeded`, error);
		} else {
			console.error(`backlink: ${context} error`, error);
		}
	}
}

/*
	Creates a backlink by storing the current location in sessionStorage
	@param {string} key - Unique identifier for this backlink context (e.g., 'SomeScreen')
	@param {string} pathname - The pathname to store (typically location.pathname)
	@param {string} search - The search/query string to store (typically location.search or searchParams.toString())
	@param {Object} options - Optional metadata to store with the backlink (cannot override url or timestamp)
 */
export function setBacklink(key, pathname, search = '', options = {}) {
	if (!key) {
		console.warn('backlink: setBacklink requires a key');
		return;
	}
	if (!pathname || typeof pathname !== 'string') {
		console.warn('backlink: setBacklink requires a pathname string');
		return;
	}

	const storageKey = STORAGE_PREFIX + key;
	const normalizedSearch = normalizeSearch(search);
	const url = pathname + (normalizedSearch ? '?' + normalizedSearch : '');

	// Defense in depth: validate URL on write as well as read
	if (!isSafeInternalPath(url)) {
		console.warn(`backlink: refusing to store unsafe URL for key "${key}":`, url);
		return;
	}

	// options are spread first to prevent overwriting core fields
	const value = JSON.stringify({
		...options,
		url,
		timestamp: Date.now(),
	});

	safeStorageOperation(() => sessionStorage.setItem(storageKey, value), 'setBacklink');
}

/*
	Convenience helper for React Router locations
	@param {string} key - Unique identifier for this backlink context
	@param {Object} location - React Router location object with pathname property
	@param {URLSearchParams|string} searchParams - Query parameters as URLSearchParams or string
	@param {Object} options - Optional metadata to store with the backlink
 */
export function setBacklinkFromLocation(key, location, searchParams, options = {}) {
	if (!location || typeof location.pathname !== 'string') {
		console.warn('backlink: setBacklinkFromLocation requires a location object with pathname');
		return;
	}
	const search = searchParams?.toString ? searchParams.toString() : String(searchParams || '');
	setBacklink(key, location.pathname, search, options);
}

/*
	Retrieves a stored backlink URL
	Returns null if the URL is not found or is not a safe internal path.
	@param {string} key - The unique identifier for this backlink context
	@returns {string|null} The stored backlink URL, or null if not found/invalid
 */
export function getBacklink(key) {
	if (!key) {
		console.warn('backlink: getBacklink requires a key');
		return null;
	}

	const storageKey = STORAGE_PREFIX + key;
	const value = safeStorageOperation(() => sessionStorage.getItem(storageKey), 'getBacklink');
	if (!value) return null;

	let url;
	try {
		const parsed = JSON.parse(value);
		url = parsed.url;
	} catch {
		// Fallback for legacy string-only storage
		url = value;
	}

	// Validate URL to prevent open redirect attacks
	if (!isSafeInternalPath(url)) {
		console.warn(`backlink: ignoring unsafe URL for key "${key}":`, url);
		return null;
	}

	return url;
}

/*
	Retrieves full backlink data including metadata
	Returns null if the URL is not found or is not a safe internal path
	@param {string} key - The unique identifier for this backlink context
	@returns {Object|null} The stored backlink data with url, timestamp, and any custom options
*/
export function getBacklinkData(key) {
	if (!key) {
		console.warn('backlink: getBacklinkData requires a key');
		return null;
	}

	const storageKey = STORAGE_PREFIX + key;
	const value = safeStorageOperation(() => sessionStorage.getItem(storageKey), 'getBacklinkData');
	if (!value) return null;

	let data;
	try {
		data = JSON.parse(value);
	} catch {
		// Fallback for legacy string-only storage
		data = { url: value, timestamp: null };
	}

	// Validate URL to prevent open redirect attacks
	if (!isSafeInternalPath(data?.url)) {
		console.warn(`backlink: ignoring unsafe URL for key "${key}":`, data?.url);
		return null;
	}

	return data;
}

/*
	Removes a backlink from sessionStorage
	@param {string} key - The unique identifier for this backlink context
 */
export function clearBacklink(key) {
	if (!key) {
		console.warn('backlink: clearBacklink requires a key');
		return;
	}

	const storageKey = STORAGE_PREFIX + key;
	safeStorageOperation(() => sessionStorage.removeItem(storageKey), 'clearBacklink');
}

/*
	Consumes a backlink - retrieves it and immediately removes it from storage
	This is the most common pattern for "one-time" back navigation
	Returns null if the URL is not found or is not a safe internal path
	@param {string} key - The unique identifier for this backlink context
	@returns {string|null} The stored backlink URL, or null if not found/invalid
 */
export function consumeBacklink(key) {
	const url = getBacklink(key);
	if (url) {
		clearBacklink(key);
	}
	return url;
}

/*
	Consumes a backlink with full data - retrieves data and immediately removes it from storage
	Returns null if the URL is not found or is not a safe internal path
	@param {string} key - The unique identifier for this backlink context
	@returns {Object|null} The stored backlink data, or null if not found/invalid
 */
export function consumeBacklinkData(key) {
	const data = getBacklinkData(key);
	if (data) {
		clearBacklink(key);
	}
	return data;
}

/*
	Factory for creating backlink handlers with a fixed key
	Useful when multiple components share the same backlink context
	@param {string} key - The unique identifier for this backlink context
	@returns {Object} Object with set, setFromLocation, get, getData, clear, consume, and consumeData methods bound to the key
*/
export function createBacklinkHandlers(key) {
	if (!key) {
		throw new Error('backlink: createBacklinkHandlers requires a key');
	}
	return {
		set: (pathname, search, options) => setBacklink(key, pathname, search, options),
		setFromLocation: (location, searchParams, options) => setBacklinkFromLocation(key, location, searchParams, options),
		get: () => getBacklink(key),
		getData: () => getBacklinkData(key),
		clear: () => clearBacklink(key),
		consume: () => consumeBacklink(key),
		consumeData: () => consumeBacklinkData(key),
		key,
	};
}
