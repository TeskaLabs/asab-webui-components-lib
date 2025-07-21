// App store context (redux like App store)
import React, { createContext, useReducer, useContext } from 'react';
import { getReducers, getInitialStates } from './reducer/reducerRegistry.jsx';

// Method to combine reducers
function combineReducers(reducers) {
	return (state, action) =>
		Object.keys(reducers).reduce(
			(acc, key) => ({
				...acc,
				[key]: reducers[key](state[key], action),
			}),
			state
		);
}

const AppStoreContext = createContext();

// SIngleton reference for getting the dispatch method within classes (object oriented code)
let globalDispatch = null;
export function getAppStoreDispatch() {
	return globalDispatch;
}

// Singleton reference for getting the state within classes (outside of React)
let globalState = null;
export function getAppStoreState() {
	return globalState;
}

// App store
export function AppStoreProvider({ children }) {
	const reducers = getReducers();
	const initialState = getInitialStates();
	const [state, dispatch] = useReducer(combineReducers(reducers), initialState);
	// Set the global dispatch and state references
	globalDispatch = dispatch;
	globalState = state;

	return (
		<AppStoreContext.Provider value={{ state, dispatch }}>
			{children}
		</AppStoreContext.Provider>
	);
}

export function useAppStore() {
	return useContext(AppStoreContext);
}

// App store selector
export function useAppSelector(selector) {
	const { state } = useAppStore();
	return selector(state);
}
