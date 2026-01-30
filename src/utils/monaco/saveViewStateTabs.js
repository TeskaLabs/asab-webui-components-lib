/*
    Utility for multi-tab Monaco editor setup.
    - Saves the Monaco editor's view state into a tab's content state.
    - Ensures that when switching tabs, the cursor(s) position, selection, and scroll state are preserved for each tab.
*/

export const saveViewStateTabs = (node, editorRef, setTabs) => {
    if (node === undefined || node === null || !editorRef.current) {
        return;
    }

    const viewState = editorRef.current.saveViewState();
    setTabs(prevTabs => {
        if (!prevTabs[node]?.content) {
            return prevTabs;
        }

        return {
            ...prevTabs,
            [node]: { ...prevTabs[node], content: { ...prevTabs[node].content, viewState } },
        };
    });
};
