// Generic utility for saving and restoring Monaco editor view state
// Can be used with any storage mechanism (Map, state, etc.)

/**
 * Save view state from a Monaco editor
 * @param {Object} editorRef - React ref containing the Monaco editor instance
 * @returns {Object|null} - The saved view state, or null if editor doesn't exist
 */
export const saveViewState = (editorRef) => {
	if (!editorRef?.current) {
		return null;
	}

	return editorRef.current.saveViewState();
};

/**
 * Restore view state to a Monaco editor
 * @param {Object} editorRef - React ref containing the Monaco editor instance
 * @param {Object} viewState - The view state to restore
 */
export const restoreViewState = (editorRef, viewState) => {
	if (!editorRef?.current || !viewState) {
		return;
	}

	editorRef.current.restoreViewState(viewState);
};

/**
 * Create a simple in-memory storage for view states
 * Useful for persisting view state across component unmounts/remounts
 */
export const createViewStateStorage = () => {
	const storage = new Map();

	return {
		/**
		 * Save view state with a key
		 * @param {string} key - Storage key
		 * @param {Object} editorRef - React ref containing the Monaco editor instance
		 */
		save: (key, editorRef) => {
			const viewState = saveViewState(editorRef);
			if (viewState) {
				storage.set(key, viewState);
			}
		},

		/**
		 * Restore view state by key
		 * @param {string} key - Storage key
		 * @param {Object} editorRef - React ref containing the Monaco editor instance
		 * @returns {boolean} - True if view state was restored, false otherwise
		 */
		restore: (key, editorRef) => {
			const viewState = storage.get(key);
			if (viewState) {
				restoreViewState(editorRef, viewState);
				storage.delete(key);
				return true;
			}
			return false;
		},

		/**
		 * Clear stored view state for a key
		 * @param {string} key - Storage key
		 */
		clear: (key) => {
			storage.delete(key);
		},

		/**
		 * Clear all stored view states
		 */
		clearAll: () => {
			storage.clear();
		},
	};
};
