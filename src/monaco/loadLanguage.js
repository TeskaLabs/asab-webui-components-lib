/*
	Lazy-load Monaco language contributions (definitions and, where needed, language services).

	Does not run at import time — call only when opening or switching editor content.

		import { loadMonacoLanguage, loadMonacoLanguageForPath } from 'asab_webui_components/monaco/loadLanguage';

		await loadMonacoLanguage('yaml');
		const language = await loadMonacoLanguageForPath('/rules/foo.yaml');

	Each language is a separate module under ./languageLoaders/ so webpack can split Monaco
	registrations into async chunks (see loadLanguage.js — no direct monaco-editor imports here).
*/

/** @type {Record<string, string>} extension (with dot) → Monaco language id */
const defaultLanguageByExtension = {
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

/** @type {Record<string, () => Promise<unknown>>} */
const languageLoaders = {
	html: () => import('./languageLoaders/html.js'),
	json: () => import('./languageLoaders/json.js'),
	css: () => import('./languageLoaders/css.js'),
	scss: () => import('./languageLoaders/scss.js'),
	javascript: () => import('./languageLoaders/javascript.js'),
	typescript: () => import('./languageLoaders/typescript.js'),
	python: () => import('./languageLoaders/python.js'),
	yaml: () => import('./languageLoaders/yaml.js'),
	xml: () => import('./languageLoaders/xml.js'),
	markdown: () => import('./languageLoaders/markdown.js'),
	sql: () => import('./languageLoaders/sql.js'),
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
 * @param {string | null | undefined} languageId
 * @returns {Promise<void>}
 */
export async function loadMonacoLanguage(languageId) {
	if (!languageId || languageId === 'plaintext' || loadedLanguages.has(languageId)) {
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
 * @param {string | null | undefined} path
 * @param {{ languages?: Record<string, string> }} [options]
 * @returns {Promise<string | null>}
 */
export async function loadMonacoLanguageForPath(path, options = {}) {
	const map = options.languages || defaultLanguageByExtension;
	const languageId = languageIdForPath(path, map);
	await loadMonacoLanguage(languageId);
	return languageId;
}

export { defaultLanguageByExtension };
