export const formatIntoTree = (inputArray, commonPath) => {
	const result = [];
	const nodeMap = new Map();

	// Build the tree without sorting
	inputArray.forEach(element => {
		const pathParts = element.name.replace(commonPath, "").substring(1).replace(/\/$/, "").split('/');
		let currentNode = result;
		let currentPath = '';  // Tracks the full path at each level

		for (let i = 0; i < pathParts.length; i++) {
			const part = pathParts[i];
			currentPath = currentPath ? `${currentPath}/${part}` : part;

			// Check if the node already exists in the node map
			let nextNode = nodeMap.get(currentPath);

			if (!nextNode) {
				// Create a new node (folder or file) if it doesn't exist
				nextNode = element.type === 'dir'
					? { type: 'folder', label: part, key: part, isDisabled: element.disabled || false, nodes: [] }
					: { type: 'file', label: part, key: part, isDisabled: element.disabled || false };

				currentNode.push(nextNode);  // Add to the parent node
				nodeMap.set(currentPath, nextNode);  // Store in the map
			}

			// Move to the next level
			currentNode = nextNode.nodes || [];
		}
	});

	// After building the entire tree, sort all nodes at once
	const sortTree = (nodes) => {
		nodes.sort(compareNodes);
		nodes.forEach(node => {
			if (node.nodes && node.nodes.length > 0) {
				sortTree(node.nodes);  // Recursively sort child nodes
			}
		});
	};

	// Sort the top-level result and then all its child nodes
	sortTree(result);

	return result;
};

// Function for comparing nodes (case-insensitive alphabetical sorting)
const compareNodes = (a, b) => {
	if (a.type === b.type) {
		return a.label.localeCompare(b.label);
	}
	return a.type === 'folder' ? -1 : 1;
};
