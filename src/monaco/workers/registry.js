/*
	Runtime registry of Monaco worker factories.
	Each `monaco/workers/<id>` module registers itself; initialize always loads `editor`.
*/

/** @type {Record<string, () => Worker>} */
export const workerFactories = Object.create(null);
