import { workerFactories } from './registry.js';

const create = () => new Worker(
	new URL('monaco-editor/languages/features/html/html.worker.js', import.meta.url),
	{ type: 'module', name: 'monaco-html-worker' }
);

workerFactories.html = create;
workerFactories.handlebars = create;
workerFactories.razor = create;
