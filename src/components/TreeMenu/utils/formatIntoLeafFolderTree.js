// Format the retrieved data into a tree structure
export const formatIntoLeafFolderTree = (inputArray, commonPath) => {
	const folders = {};
	// Group folders by their parent folder
	inputArray.forEach(element => {
		// Omit everything that is not of type 'dir'
		if (element.type !== "dir") {
			return
		}
		const pathParts = element.name.replace(commonPath, "").substring(1).replace(/\/$/, "").split('/');
		let current = folders;
		pathParts.forEach(part => {
			if (!current[part]) {
				current[part] = {};
			}
			current = current[part];
		});
	});

	// Recursive function to build the output structure
	function buildNodes(node) {
		return Object.keys(node).map(label => {
			const children = buildNodes(node[label]);
			// Filter for leaf folders, which are considered as files for tree menu representation
			if (children.length > 0) {
				return {
					type: 'folder',
					label,
					key: label,
					nodes: children
				};
			} else {
				return {
					type: 'file',
					label,
					key: label
				};
			}
		});
	}

	// Build the output structure
	const outputData = buildNodes(folders);
	return outputData.sort(compareNodes);
};

// Sort items alphabetically
const compareNodes = (a, b) => {
	return a.label.localeCompare(b.label);
};
