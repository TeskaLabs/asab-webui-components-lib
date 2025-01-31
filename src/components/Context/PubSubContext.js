import React, { createContext, useContext, useRef, useCallback } from 'react';

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

	return (
		<PubSubContext.Provider value={{ app, subscribe, publish }}>
			{children}
		</PubSubContext.Provider>
	);
}
