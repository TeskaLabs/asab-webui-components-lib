import { workerFactories } from './registry.js';

const create = () => new Worker(
	new URL('monaco-editor/languages/features/css/css.worker.js', import.meta.url),
	{ type: 'module', name: 'monaco-css-worker' }
);

workerFactories.css = create;
workerFactories.scss = create;
workerFactories.less = create;
