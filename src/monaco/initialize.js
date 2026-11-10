/*
	Monaco initialize entry (webpack 5 native workers + MonacoEnvironment).

	Call from a lazily-loaded editor screen — not from the shell bootstrap / app entry:

		import { initializeMonaco } from 'asab_webui_components/monaco/initialize';

		await initializeMonaco(); // registers editor worker
		await import('asab_webui_components/monaco/languages/yaml');
		// language services also: import('asab_webui_components/monaco/workers/json')
*/

import { initializeMonacoEnvironment } from './utils/initializeMonacoEnvironment.js';

/**
 * Idempotent Monaco environment / worker setup for Module Federation.
 *
 * @returns {Promise<void>}
 */
export async function initializeMonaco() {
	initializeMonacoEnvironment();
}

export { initializeMonacoEnvironment };
