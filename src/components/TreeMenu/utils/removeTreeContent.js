/*
	Filters the provided data structure, removing files and folders based on the arguments criteria.
	Folders are included in the result if they contain at least one visible file or subfolder after filtering.
	Empty folders are not added unless they contain visible files or folders.
*/
export const removeTreeContent = (data, { folders = [], files = [] }) => {
	// If the values are empty, just return the data
	if ((folders.length === 0) && (files.length === 0)) {
		return data;
	}
	// Create a Set for quick lookup and elimination
	const selectedFolders = new Set(folders);
	const filesToRemove = new Set(files);

	const filteredData = data.filter(item => {
		// Check if the item is a file
		if (item.type === 'item') {
			const itemName = item.name.split('/').pop();

			// If the file name is specified in files, mark it for deletion
			if (filesToRemove.has(itemName)) {
				return false; // Remove this file
			}

			// Check if the file's directory should be removed
			for (const folder of selectedFolders) {
				if (item.name.includes(`/${folder}/`)) {
					return false; // Remove this file since its parent folder is being deleted
				}
			}

			return true; // Include files not filtered out
		}

		// Check if the item is a folder
		if (item.type === 'dir') {
			const folderName = item.name.split('/').filter(Boolean).pop();

			// If the folder is specified for deletion, mark its contents for removal
			if (selectedFolders.has(folderName)) {
				return false; // Remove this folder
			}

			// If this folder is somehow affected by the specified folders, return false (to remove its contents)
			for (const folder of selectedFolders) {
				if (item.name.includes(`/${folder}/`)) {
					return false; // Remove this folder since it is under a deleted directory
				}
			}

			return true; // Include folders not filtered out
		}

		return true; // Include other types of items
	});

	// After the initial filtering, check for empty folders
	const finalData = filteredData.filter(item => {
		if (item.type === 'dir') {
			// If the folder does not contain any items, filter it out
			return filteredData.some(innerItem => innerItem.name.startsWith(item.name) && (innerItem.type === 'item'));
		}

		// Include files and folders not affected by the empty check
		return true;
	});

	return finalData;
};
