/*
	Monaco editor problem markers

	This is to be used only with Monaco editor!

	Example of usage

	```
		import * as monaco from 'monaco-editor'; // Import monaco
		...

		const model = editorRef.current.getModel(); // Set model (this is just an example)
		...

		// Use setProblemMarkers as a method wherever needed to set a problem markers
		const setProblemMarkers = (problems, model) => {
			// Use problemMarkers util from asab webui components to get the monaco markers
			const markers = problemMarkers({problems, model});

			monaco.editor.setModelMarkers(model, 'owner', markers);
		};
		...
	```

*/

export const problemMarkers = ({ problems, model }) => {
	const markers = [];
	if (problems) {
		for (const problem of problems) {
			let message = problem.message || problem.problem; // Fallback on problem
			// Validation on empty lines
			if (message && !message.endsWith('\n\n')) {
				// Add a empty line to the end of a message if the message ends with less than 2 newlines
				if (!message.endsWith('\n')) {
					message = message + '\n\n';
				} else {
					message = message + '\n';
				}
			}

			markers.push({
				message: message,
				severity: problem.severity || 8, // 1 = hint, 2 = info, 4 = warning, 8 = error
				startLineNumber: problem.line_start || problem.line,
				startColumn: problem.column_start || problem.column,
				endLineNumber: problem.line_end || problem.line,
				endColumn: problem.column_end || (problem.column_start && model?.getLineLength(problem.column_start) + 1) || (problem.line && model?.getLineLength(problem.line) + 1),
				tags: problem.tags || null, // Example [2] (possible values 2 | 1)
				code: problem.code || null, // Example { target: 'https://teskalabs.com', value: 'TeskaLabs' }
				source: problem.source || null, // Example 'asab-parser'
			});
		}
	}

	return markers;
}
