// Reducer registry for dynamic reducer registration
const reducers = {};
const initialStates = {};

// Register reducer
export function registerReducer(key, reducer) {
	/*
		The initial state is retrieved by calling the reducer with an undefined state
		This can be handled because of default `state = initialState` pattern in the reducers
	*/
	const initialState = reducer(undefined, { type: '@@ASAB_APP_STORE/INIT_STATE' }); // @@ASAB_APP_STORE/INIT_STATE type used to avoid any potential reducer type collision
	reducers[key] = reducer;
	initialStates[key] = initialState;
}

// Get reducers
export function getReducers() {
	return { ...reducers };
}

// Get initial states in AppStore
export function getInitialStates() {
	return { ...initialStates };
}
