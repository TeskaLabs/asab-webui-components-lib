// App store context (redux like App store)
import React, { createContext, useReducer, useContext, useCallback } from 'react';
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

/*
	Method to create app store

	Usage:

	class Application extends Component {

		...

		constructor(props) {
			super(props);

			// Global AppStore variables
			this.AppStore = createAppStore();

		...

		<AppStoreProvider app={this}>
			...


	}

	const state = this.App.AppStore.getState();
	this.App.AppStore.dispatch({type: "myType", payload: ["abc", "def"]})
*/
export function createAppStore() {
	// Get the initial states
	const initialState = getInitialStates();
	const rootReducer = (state, action) => {
		// Get the latest reducers
		const reducers = getReducers();
		return combineReducers(reducers)(state, action);
	};

	return {
		// State of the store
		state: initialState,
		// Listeners for subscriber methods - used for notification if something new is added to the store (dynamic update)
		listeners: [],
		// Get the current state
		getState() {
			return this.state;
		},
		// Update the state by dispatching an action
		dispatch(action) {
			this.state = rootReducer(this.state, action);
			// Notify all subscribers of the action about the update
			this.listeners.forEach(fn => fn(this.state));
		},
		// Subscribe a new listener
		subscribe(fn) {
			this.listeners.push(fn);
			return () => {
				this.listeners = this.listeners.filter(l => l !== fn);
			}
		}
	};
}

const AppStoreContext = createContext();

// App store
export function AppStoreProvider({ children, app }) {
	// Pulls the current reducer set on every action:
	const reducerFn = useCallback((state, action) => combineReducers(getReducers())(state, action), []);

	const [state, dispatch] = useReducer(reducerFn, app.AppStore.state);

	// Wrapped dispatch to update both React state and global AppStore.state
	const wrappedDispatch = (action) => {
		// First, dispatch to React reducer
		dispatch(action);

		// Immediately compute the new state manually
		// This ensures this.AppStore.state is always in sync
		const newState = reducerFn(app.AppStore.state, action);
		app.AppStore.state = newState;

		// Notify listeners (if there is a manual update)
		app.AppStore.listeners.forEach(fn => fn(newState));
	};

	// Set the global dispatch and state references
	app.AppStore.state = state; // Initial reference
	app.AppStore.dispatch = wrappedDispatch;

	return (
		<AppStoreContext.Provider value={{ state, dispatch: wrappedDispatch }}>
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
