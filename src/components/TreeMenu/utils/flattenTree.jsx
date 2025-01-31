// Util for flattening the tree menu data
export const flattenTree = (nodes, parentPath = '') => {
	if (!nodes) {
		return [];
	}

	return nodes.reduce((acc, node) => {
		// Set current path
		const currentPath = parentPath ? `${parentPath}/${node.label}` : node.label;
		if (node.type === 'file') {
			acc.push({
				...node, // Spread the existing properties
				type: 'file', // Override some existing properties
				label: parentPath ? currentPath : node.label, // Include path in label only for files being flattened
				key: parentPath ? currentPath : node.key, // Same for key
			});
		} else if (node.type === 'folder') {
			const childNodes = flattenTree(node.nodes, currentPath);
			// Determine if folder should be flattened or preserved
			if ((childNodes.length === 1) && (childNodes[0].type === 'file')) {
				// Flatten the folder if it contains exactly one file
				acc.push(childNodes[0]);
			} else {
				// Preserve the folder structure, adjusting file paths inside
				acc.push({
					...node, // Spread the existing properties
					nodes: childNodes.map(childNode => {
						if (childNode.type === 'file') {
							// Remove the folder path from the label and key for non-flattened files
							return {
								...childNode,
								label: childNode.label.replace(`${currentPath}/`, ''),
								key: childNode.key.replace(`${currentPath}/`, '')
							};
						}
						return childNode;
					}),
				});
			}
		}

		return acc;
	}, []);
};
