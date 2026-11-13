# Monaco Editor (`asab_webui_components/monaco`)

Helpers for using [Monaco Editor](https://microsoft.github.io/monaco-editor/) in **ASAB WebUI microfrontends** (Module Federation remotes). The library does **not** ship Monaco itself or web workers; each remote that renders an editor bundles `monaco-editor` and configures webpack.

## Package entries

| Import | Purpose |
|--------|---------|
| `asab_webui_components/monaco/initialize` | Side effect: sets `MonacoEnvironment.getWorker` for MF + cross-origin workers. Import **before** creating editors. |
| `asab_webui_components/monaco/loadLanguage` | `loadMonacoLanguage`, `loadMonacoLanguageForPath`, `languageIdForPath`, `defaultLanguageByExtension` |
| `asab_webui_components/monaco` | `{ problemMarkers }` - map API/validation errors to Monaco marker shape |

Peer dependency: `monaco-editor` (^0.57.0, optional in `package.json` but required for Monaco screens).

---

## Quick checklist (new remote with Monaco)

1. Add dependencies in the **remote app** (confirm versions with your WebUI stack):
   - `monaco-editor`
   - `monaco-editor-webpack-plugin`
2. In `webpack.common.js`:
   - `MonacoWebpackPlugin({ languages: [...] })` - only languages that need **workers** (see table below).
   - Resolve alias: `'monaco-editor$': 'monaco-editor/editor/editor.api'` (Monaco ≥ 0.57).
3. Do **not** add `monaco-editor` to Module Federation `shared`.
4. In the editor screen/module (lazy route, not `main.js`):
   - `import 'asab_webui_components/monaco/initialize'`
   - `import * as monaco from 'monaco-editor'`
   - `await loadMonacoLanguage(...)` or `loadMonacoLanguageForPath(...)` before `createModel` / set language.
5. After changing `languages[]` or editor file types, run bundle analysis (see repo WebUI bundle-analyze skill).

---

## Webpack setup

### 1. `monaco-editor-webpack-plugin`

Workers are emitted next to `remoteEntry.js` / hashed chunks. List only what this remote needs:

```js
// webpack.common.js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  plugins: [
    // ...
    new MonacoWebpackPlugin({
      languages: ['json', 'html'], // example: ASAB Library
    }),
  ],
};
```

**`languages: []`** is valid when editors only use built-in `plaintext` or languages that need **no** dedicated worker (e.g. YAML syntax via lazy `loadLanguage` only). Parser builder uses this; declaration editor loads YAML at runtime.

| Plugin `languages` entry | Worker file | Notes |
|--------------------------|---------------|--------|
| (none / unlisted) | `editor.worker.js` | Fallback for highlighting-only languages |
| `json` | `json.worker.js` | JSON language service |
| `css`, `scss`, `less` | `css.worker.js` | |
| `html`, `handlebars`, `razor` | `html.worker.js` | |
| `typescript` | `ts.worker.js` | Large; also used for JS **language service** when TS is included |
| `javascript` alone | (no `ts.worker`) | Syntax registration only |

`initialize` maps Monaco worker labels to these filenames using the remote’s webpack `publicPath`.

**Keep plugin config in sync with your editors** - add a short comment in webpack pointing at the component that decides languages (see `asab_library_webui`, `bs_query_webui`, `lmio_parser_builder_webui` in the PoC).

#### Examples from PoC remotes

**Many file types, JSON/HTML IntelliSense** (`asab_library_webui`):

```js
new MonacoWebpackPlugin({
  languages: ['json', 'html'],
}),
```

**Export query editor - JSON worker only** (`bs_query_webui`; SQL/plaintext via `loadMonacoLanguage`):

```js
new MonacoWebpackPlugin({
  languages: ['json'],
}),
```

**YAML-only, no extra workers** (`lmio_parser_builder_webui`):

```js
new MonacoWebpackPlugin({
  languages: [],
}),
```

### 2. Monaco 0.57 - `editor.api` alias (required)

From 0.57, `import 'monaco-editor'` can resolve to an entry that pulls **all** languages and a multi‑MB `ts.worker`, ignoring `MonacoWebpackPlugin({ languages })`.

Add to `resolve.alias` in **every** federated app that uses Monaco (including apps that only pull Monaco through `monaco/initialize`):

```js
resolve: {
  alias: {
    'monaco-editor$': 'monaco-editor/editor/editor.api',
  },
},
```

Use the exported subpath `monaco-editor/editor/editor.api`, not deep `monaco-editor/esm/vs/...` paths (package exports).

### 3. Local development (optional)

PoC apps often alias the components lib source in `webpack.dev.js` so Monaco changes apply without republishing:

```js
// webpack.dev.js - merge into resolve.alias
{
  'asab_webui_components/monaco/initialize': path.resolve(
    CWD, '..', '..', 'asab-webui-components-lib', 'src', 'monaco', 'initialize.js',
  ),
  'asab_webui_components/monaco/loadLanguage': path.resolve(
    CWD, '..', '..', 'asab-webui-components-lib', 'src', 'monaco', 'loadLanguage.js',
  ),
  'asab_webui_components/monaco': path.resolve(
    CWD, '..', '..', 'asab-webui-components-lib', 'src', 'monaco',
  ),
}
```

Adjust paths to your monorepo layout.

---

## Module Federation

- **Do not** put `monaco-editor` in `shared` (especially not as a singleton). Each remote must own its Monaco build and `languages[]`; otherwise workers and highlighting come from whichever remote loaded first.
- Import `monaco/initialize` in the **remote** that creates editors. It uses that remote’s `__webpack_public_path__` so worker URLs resolve to the correct origin (shell vs remote port in dev).
- `MonacoEnvironment` is global. `initialize` re-binds `getWorker` when this remote calls `create` / `createDiffEditor` / `createModel`. Normal navigation uses one Monaco remote at a time; two live editors in different remotes can still race on worker spawn.

---

## Runtime usage

### 1. Initialize workers (side effect)

```js
// Editor screen module - not app main.js / remote expose entry
import 'asab_webui_components/monaco/initialize';
import * as monaco from 'monaco-editor';
```

### 2. Lazy-load language support

Syntax/features are **not** loaded at app init. Call before `createModel` or when switching language:

```js
import {
  loadMonacoLanguage,
  loadMonacoLanguageForPath,
  languageIdForPath,
  defaultLanguageByExtension,
} from 'asab_webui_components/monaco/loadLanguage';

// Fixed language
await loadMonacoLanguage('yaml');

// From path (default extension map in the library)
const languageId = await loadMonacoLanguageForPath('/tenant/rules/foo.yaml');
const model = monaco.editor.createModel(content, languageId ?? 'plaintext');

// App-specific extension map (recommended when you only support a few types)
const libraryMap = { '.yaml': 'yaml', '.yml': 'yaml', '.json': 'json' };
await loadMonacoLanguageForPath(path, { languages: libraryMap });
const id = languageIdForPath(path, libraryMap);
```

Supported lazy loaders (see `languageLoaders/`): `html`, `json`, `css`, `scss`, `javascript`, `typescript`, `python`, `yaml`, `xml`, `markdown`, `sql`. Each loads in its own async chunk on first use.

`loadMonacoLanguage` is idempotent per page load (cached in a `Set`). Unknown ids and `plaintext` are no-ops.

### 3. React pattern (async init + cleanup)

Editors should guard against unmount while language chunks load:

```jsx
useEffect(() => {
  let cancelled = false;

  (async () => {
    await loadMonacoLanguage('markdown');
    if (cancelled || editorRef.current) {
      return;
    }

    editorRef.current = monaco.editor.create(containerRef.current, {
      language: 'markdown',
      // ...
    });
  })();

  return () => {
    cancelled = true;
    editorRef.current?.dispose();
    editorRef.current = null;
  };
}, []);
```

For models created after fetch:

```js
const language = await loadMonacoLanguageForPath(itemPath);
const model = monaco.editor.createModel(value, language ?? 'plaintext');
editor.setModel(model);
```

**Plaintext** editors do not need `loadMonacoLanguage` (e.g. log input with `language: 'plaintext'`).

### 4. Dynamic language switching

If content language can change after edit (e.g. SQL vs JSON heuristics), call `loadMonacoLanguage` then `monaco.editor.setModelLanguage(model, id)` when the id changes. Handle the promise without `void` if your ESLint config disallows it:

```js
applyModelLanguage(model, languageId).catch(() => undefined);
```

### 5. Problem markers

```js
import { problemMarkers } from 'asab_webui_components/monaco';

const markers = problemMarkers({ problems: apiValidationErrors, model });
monaco.editor.setModelMarkers(model, 'owner', markers);
```

---

## What webpack does vs what `loadLanguage` does

| Concern | `MonacoWebpackPlugin` `languages[]` | `loadMonacoLanguage*` |
|--------|-------------------------------------|-------------------------|
| Worker `.js` assets on disk | Yes | No |
| Syntax / tokenizer registration at runtime | Partial (plugin still registers listed langs) | Yes, per language chunk |
| Keeps initial MF `remoteEntry` small | N/A | Languages load on demand |

List **workers** in the plugin; register **extra** languages at runtime when editors need them.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|--------|----------------|-----|
| Workers fail in dev (shell on :3000, remote on other port) | Cross-origin worker load | Ensure `monaco/initialize` is imported in that remote before `create` |
| Huge `ts.worker` in bundle report | Missing `monaco-editor$` → `editor.api` alias or `typescript` in `languages` | Add alias; remove `typescript` from plugin unless required |
| No highlighting for `.yaml` | Language not loaded | `await loadMonacoLanguage('yaml')` before model |
| JSON validation missing | No `json` in plugin | Add `json` to `MonacoWebpackPlugin` **and** `loadMonacoLanguage('json')` |
| Wrong highlighting after switching remotes | Shared Monaco (unsupported) | Remove `monaco-editor` from MF `shared` |

---

## Adding a new language to the library

1. Add `languageLoaders/<id>.js` importing the correct Monaco 0.57 `register` modules (definitions vs features - mirror an existing similar language).
2. Register the loader in `loadLanguage.js` (`languageLoaders` + `defaultLanguageByExtension` if applicable).
3. Document whether the consuming app must add the id to `MonacoWebpackPlugin` for a worker.
4. Run bundle analysis on every PoC app that imports `loadLanguage`.

---

## Related source

- `initialize.js` - entry side effect
- `utils/initializeMonacoEnvironment.js` - worker URL logic
- `loadLanguage.js` - lazy language API
- `languageLoaders/*.js` - one dynamic import per language
- `index.js` - `problemMarkers` export
