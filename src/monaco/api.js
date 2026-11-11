/*
	Monaco editor API without the full language dump.

	Monaco 0.57 bare `monaco-editor` resolves to `esm/vs/index.js` (all languages).
	Apps and this package should import from here instead:

		import * as monaco from 'asab_webui_components/monaco/api';
*/

export * from 'monaco-editor/editor/editor.api';
