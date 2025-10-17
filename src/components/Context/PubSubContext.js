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
		if (!event || typeof callback !== 'function') {
			console.error('PubSub subscribe requires a valid event name and callback function');
			return () => {}; // Return no-op unsubscribe
		}

		if (!eventsRef.current[event]) {
			eventsRef.current[event] = [];
		}
		eventsRef.current[event].push(callback);

		// Return unsubscribe function
		return () => {
			if (eventsRef.current[event]) {
				eventsRef.current[event] = eventsRef.current[event].filter(cb => cb !== callback);
			}
		};
	}, []);

	// Publish an event
	const publish = useCallback((event, data) => {
		if (eventsRef.current[event]) {
			eventsRef.current[event].forEach(callback => {
				try {
					callback(data);
				} catch (error) {
					console.error(`Error in PubSub callback for event "${event}":`, error);
				}
			});
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
			// Clear all subscriptions on unmount to prevent memory leaks
			eventsRef.current = {};
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
