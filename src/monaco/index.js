/*
	Optional Monaco helpers (e.g. problemMarkers).
	Editor API: `import * as monaco from 'asab_webui_components/monaco/api'`
	Workers: `initializeMonaco` from `asab_webui_components/monaco/initialize`
	Lazy languages: `asab_webui_components/monaco/loadLanguage` (separate entry —
	do not re-export here or problemMarkers pulls every language/worker chunk)
	Direct: `monaco/languages/<id>`
*/

export { problemMarkers } from './utils/problemMarkers.jsx';
export { initializeMonaco, initializeMonacoEnvironment } from './initialize.js';
