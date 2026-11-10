import { workerFactories } from './registry.js';

workerFactories.json = () => new Worker(
	new URL('monaco-editor/languages/features/json/json.worker.js', import.meta.url),
	{ type: 'module', name: 'monaco-json-worker' }
);
