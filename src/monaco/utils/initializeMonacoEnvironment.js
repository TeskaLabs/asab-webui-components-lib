/*
	MonacoEnvironment for Module Federation remotes — workers via webpack 5 native
	`new Worker(new URL(..., import.meta.url))` (no monaco-editor-webpack-plugin).

	Worker factories live in `asab_webui_components/monaco/workers/*` so each remote only
	emits workers it imports (editor is always registered from initialize).

	Multi-remote note:
	- `self.MonacoEnvironment` is page-global. Monaco is not MF-shared; initialize wraps this
	  remote's editor factories to rebind getWorker before create/createModel.
	- Residual: two remotes with live editors at once can still race on a late worker spawn.

	NOTE: Do not MF-share `monaco-editor` as a singleton across remotes.
	Prefer `initializeMonaco()` from a lazily-loaded screen, then import needed
	`monaco/languages/*` and (for language services) `monaco/workers/*`.

	MF smoke: verify worker requests under shell↔remote different origins.
*/

import * as monaco from '../api.js';
import { workerFactories } from '../workers/registry.js';
// Always emit / register the base editor worker for this remote.
import '../workers/editor.js';

// One wrap per module instance (avoids nested wrappers if initialize runs again).
let didWrapEditorApis = false;

function createWorker(label) {
	const create = workerFactories[label] || workerFactories.editorWorkerService;
	if (typeof create !== 'function') {
		throw new Error(
			`Monaco worker for "${label}" is not registered. ` +
			`Import asab_webui_components/monaco/workers/<id> (or rely on the default editor worker).`
		);
	}
	return create();
}

function applyEnv() {
	self.MonacoEnvironment = {
		getWorker(_moduleId, label) {
			return createWorker(label);
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
