// Save editor view state (scroll, cursor, etc.) into libraryTabs for a given node
export const saveViewStateTabs = (node, editorRef, setLibraryTabs) => {
    if (!node || !editorRef.current) {
        return;
    }

    const viewState = editorRef.current.saveViewState();
    setLibraryTabs(prevTabs => {
        if (!prevTabs[node]?.content) {
            return prevTabs;
        }

        return {
            ...prevTabs,
            [node]: { ...prevTabs[node], content: { ...prevTabs[node].content, viewState } },
        };
    });
};
