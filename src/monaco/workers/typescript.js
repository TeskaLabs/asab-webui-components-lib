import { workerFactories } from './registry.js';

const create = () => new Worker(
	new URL('monaco-editor/languages/features/typescript/ts.worker.js', import.meta.url),
	{ type: 'module', name: 'monaco-ts-worker' }
);

workerFactories.typescript = create;
workerFactories.javascript = create;
