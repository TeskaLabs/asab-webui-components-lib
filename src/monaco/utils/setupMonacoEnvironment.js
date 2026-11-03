/*
	Fix for broken Monaco Editor web workers in the microfrontend (Module Federation) setup.

	Root cause:
	- `monaco-editor` is shared as a singleton, so the single Monaco instance (including the
	  `MonacoEnvironment` injected by monaco-editor-webpack-plugin) may be provided by *another*
	  remote (e.g. lmio_alert_management_webui). Its `getWorkerUrl()` then builds worker URLs
	  against *that* remote's webpack publicPath, i.e. a different origin than the shell app.
	- For cross-origin worker URLs monaco-editor-webpack-plugin bootstraps the worker via a Blob
	  containing `import "<url>"` (ESM syntax), but Monaco spawns a *classic* worker from it.
	  Classic workers cannot execute `import` -> "Uncaught SyntaxError: Cannot use import
	  statement outside a module", the worker dies and every language feature fails with
	  "Error: Unexpected usage" (loadForeignModule).

	Fix:
	- Define our own `MonacoEnvironment.getWorker` (Monaco prefers it over `getWorkerUrl`).
	  Cross-origin workers are bootstrapped via a Blob with `importScripts()`, which - unlike
	  ESM `import` - is allowed to load cross-origin classic scripts.

	NOTE: `import 'monaco-editor'` below is intentional. monaco-editor-webpack-plugin assigns
	its (broken) `MonacoEnvironment` when the monaco module is evaluated, so this module must
	be evaluated *after* monaco to win. Importing monaco here guarantees the order no matter
	where this module is imported from. Prefer `import 'asab_webui_components/monaco/setup'`
	from a lazily-loaded screen to avoid loading monaco on app start.
*/

import 'monaco-editor';

/* global __webpack_public_path__ */

// Language label -> worker file emitted by monaco-editor-webpack-plugin ([name].worker.js)
const workerFiles = {
	editorWorkerService: 'editor.worker.js',
	json: 'json.worker.js',
	css: 'css.worker.js',
	scss: 'css.worker.js',
	less: 'css.worker.js',
	html: 'html.worker.js',
	handlebars: 'html.worker.js',
	razor: 'html.worker.js',
	typescript: 'ts.worker.js',
	javascript: 'ts.worker.js',
};

// Base URL of this remote's build output (worker files are emitted next to remoteEntry.js).
// __webpack_public_path__ is replaced by webpack with the runtime public path of this build.
const baseUrl = new URL(
	(typeof __webpack_public_path__ === 'string' && __webpack_public_path__) || '',
	document.baseURI
).href;

export function setupMonacoEnvironment() {
	self.MonacoEnvironment = {
		getWorker(moduleId, label) {
			const fileName = workerFiles[label] || workerFiles.editorWorkerService;
			const workerUrl = new URL(fileName, baseUrl).href;

			// Same origin (production behind nginx, standalone dev-server): spawn directly
			if (new URL(workerUrl).origin === window.location.origin) {
				return new Worker(workerUrl);
			}

			// Cross origin (shell app + remotes on different ports/origins):
			// bootstrap via a Blob with importScripts, allowed for cross-origin classic scripts
			const blob = new Blob([`importScripts("${workerUrl}");`], { type: 'application/javascript' });
			return new Worker(URL.createObjectURL(blob));
		},
	};
}
