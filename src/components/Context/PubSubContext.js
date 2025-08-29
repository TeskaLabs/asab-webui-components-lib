import React, { createContext, useContext, useRef, useCallback, useLayoutEffect, useMemo } from 'react';

// Create a context
const PubSubContext = createContext();

export function usePubSub() {
	return useContext(PubSubContext);
}

export function PubSubProvider({ children, app }) {
	const eventsRef = useRef({});
	// Subscribe to an event
	const subscribe = useCallback((event, callback) => {
		if (!eventsRef.current[event]) {
			eventsRef.current[event] = [];
		}
		eventsRef.current[event].push(callback);

		// Return unsubscribe function
		return () => {
			eventsRef.current[event] = eventsRef.current[event].filter(cb => cb !== callback);
		};
	}, []);

	// Publish an event
	const publish = useCallback((event, data) => {
		if (eventsRef.current[event]) {
			eventsRef.current[event].forEach(callback => callback(data));
		}
	}, []);

	// Assign a publish and subscribe methods to a app object (to obtain the publish/subscribe in non-react environments)
	useLayoutEffect(() => {
		if (app) {
			app.PubSub = { publish, subscribe };
		}
		return () => {
			if (app) {
				app.PubSub = undefined;
			}
		};
	}, [app, publish, subscribe]);

	// Memoized pubsub values, to avoid unnecessary re-renders
	const value = useMemo(() => ({ app, subscribe, publish }), [app, subscribe, publish]);

	return (
		<PubSubContext.Provider value={value}>
			{children}
		</PubSubContext.Provider>
	);
}
