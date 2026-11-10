/*
	Lazy-load Monaco language contributions (and optional language-service workers).

		import { loadMonacoLanguage, loadMonacoLanguageForPath } from 'asab_webui_components/monaco/loadLanguage';

		await loadMonacoLanguage('yaml');
		const language = await loadMonacoLanguageForPath('/rules/foo.yaml');
*/

/** @type {Record<string, string>} extension (with dot) → Monaco language id */
export const defaultLanguageByExtension = {
	'.html': 'html',
	'.xml': 'xml',
	'.js': 'javascript',
	'.jsx': 'javascript',
	'.ts': 'typescript',
	'.tsx': 'typescript',
	'.py': 'python',
	'.yaml': 'yaml',
	'.yml': 'yaml',
	'.json': 'json',
	'.css': 'css',
	'.scss': 'scss',
	'.less': 'css',
	'.md': 'markdown',
	'.sql': 'sql',
	'.svg': 'xml',
};

// Language contribution (+ worker only where a language service is used).
// css/scss/less: definitions only by default (no css.worker) — import workers/css explicitly if needed.
const languageLoaders = {
	html: () => Promise.all([
		import('./languages/html.js'),
		import('./workers/html.js'),
	]),
	json: () => Promise.all([
		import('./languages/json.js'),
		import('./workers/json.js'),
	]),
	css: () => import('./languages/css.js'),
	scss: () => import('./languages/scss.js'),
	javascript: () => import('./languages/javascript.js'),
	typescript: () => Promise.all([
		import('./languages/typescript.js'),
		import('./workers/typescript.js'),
	]),
	python: () => import('./languages/python.js'),
	yaml: () => import('./languages/yaml.js'),
	xml: () => import('./languages/xml.js'),
	markdown: () => import('./languages/markdown.js'),
	sql: () => import('./languages/sql.js'),
};

const loadedLanguages = new Set();

/**
 * @param {string | null | undefined} path
 * @param {Record<string, string>} [extensionMap]
 * @returns {string | null}
 */
export function languageIdForPath(path, extensionMap = defaultLanguageByExtension) {
	const extension = path?.match(/\.[0-9a-z]+$/i)?.[0]?.toLowerCase();
	if (!extension) {
		return null;
	}
	return extensionMap[extension] || null;
}

/**
 * Load language contribution (and default worker pairing) once per language id.
 * @param {string | null | undefined} languageId
 * @returns {Promise<void>}
 */
export async function loadMonacoLanguage(languageId) {
	if (!languageId || loadedLanguages.has(languageId)) {
		return;
	}
	const loader = languageLoaders[languageId];
	if (!loader) {
		return;
	}
	await loader();
	loadedLanguages.add(languageId);
}

/**
 * Resolve language from path extension, then lazy-load it.
 * @param {string | null | undefined} path
 * @param {{ languages?: Record<string, string> }} [options]
 * @returns {Promise<string | null>} Monaco language id (or null)
 */
export async function loadMonacoLanguageForPath(path, options = {}) {
	const languageId = languageIdForPath(path, options.languages || defaultLanguageByExtension);
	await loadMonacoLanguage(languageId);
	return languageId;
}
