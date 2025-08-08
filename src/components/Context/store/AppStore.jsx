// App store context (redux like App store)
import React, { createContext, useReducer, useContext, useEffect } from 'react';
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

// App store
export function AppStoreProvider({ children, app }) {
	const reducers = getReducers();
	const initialState = getInitialStates();
	const [state, dispatch] = useReducer(combineReducers(reducers), initialState);

	// Set the global dispatch and state references
	useEffect(() => {
		app.AppStore.dispatch = dispatch;
		app.AppStore.state = state;
	}, [state, dispatch])

	return (
		<AppStoreContext.Provider value={{ state, dispatch }}>
			{children}
		</AppStoreContext.Provider>
	);
}

// App store hook
export function useAppStore() {
	/*
		Returns provider context i.e. dispatch
		const { dispatch } = useAppStore();
	*/
	return useContext(AppStoreContext);
}

// App store selector
export function useAppSelector(selector) {
	/*
		Returns provider context state

		const myState = useAppSelector(state => state.myState);
	*/
	const { state } = useAppStore();
	return selector(state);
}
