/*
	Fix for broken Monaco Editor web workers in the microfrontend (Module Federation) setup.

	Root cause:
	- Monaco (and its workers) are served from a *remote* `publicPath` / origin, while the shell
	  app runs on another origin. monaco-editor-webpack-plugin's default `getWorkerUrl` may
	  bootstrap cross-origin workers via a Blob with ESM `import "…"`, but Monaco spawns a
	  *classic* worker - classic workers cannot `import` → worker dies ("Unexpected usage").

	Fix:
	- Define our own `MonacoEnvironment.getWorker` (Monaco prefers it over `getWorkerUrl`).
	  Cross-origin workers use a Blob with `importScripts()`, which is allowed for classic workers.

	Multi-remote note:
	- `self.MonacoEnvironment` is page-global. Monaco is not MF-shared, so each remote has its
	  own `monaco` module. Initialization rebinds getWorker to this remote's publicPath, and wraps
	  this remote's editor factories to rebind again right before create/createModel — so a
	  remount (e.g. alerts) does not keep using another remote's worker base URL.
	- Residual: two remotes with live editors at once can still race on a late worker spawn;
	  normal navigation is one active Monaco remote at a time.

	NOTE: Do not MF-share `monaco-editor` as a singleton across remotes (each remote should own
	its Monaco + trimmed languages[]). This initialization still applies per remote for worker URLs.

	NOTE: `import * as monaco` below is intentional. The plugin assigns `MonacoEnvironment`
	when monaco is evaluated; this module must run *after* that so our getWorker wins.
	Prefer `import 'asab_webui_components/monaco/initialize'` from a lazily-loaded screen.
*/

import * as monaco from 'monaco-editor';

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

// One wrap per module instance (avoids nested wrappers if initialize runs again).
let didWrapEditorApis = false;

function applyEnv() {
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
			const blob = new Blob(
				[`importScripts(${JSON.stringify(workerUrl)});`],
				{ type: 'application/javascript' }
			);
			return new Worker(URL.createObjectURL(blob));
		},
	};
}

function wrapEditorApis() {
	if (didWrapEditorApis) {
		return;
	}
	didWrapEditorApis = true;

	for (const name of ['create', 'createDiffEditor', 'createModel']) {
		const original = monaco.editor[name];
		if (typeof original !== 'function') {
			continue;
		}
		monaco.editor[name] = function (...args) {
			applyEnv();
			return original.apply(this, args);
		};
	}
}

export function initializeMonacoEnvironment() {
	applyEnv();
	// Rebind before this remote creates editors/models (covers alerts dispose → remount).
	wrapEditorApis();
}
