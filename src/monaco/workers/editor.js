import { workerFactories } from './registry.js';

// Webpack 5 emits this as a worker chunk from the static new URL(...).
workerFactories.editorWorkerService = () => new Worker(
	new URL('monaco-editor/editor/editor.worker.js', import.meta.url),
	{ type: 'module', name: 'monaco-editor-worker' }
);
