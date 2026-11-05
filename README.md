# TeskaLabs ASAB WebUI Components Library

Components library of ASAB used in WebUI projects.

## Getting started

```
pnpm add asab_webui_components
```

## Usage

```
import { Module } from 'asab_webui_components';
```

Possible imports:

- Module
- Service
- Renderer
- Humanize, humanizeToString
- DataTable2, DataTableCard2, DataTableCardFooter2, DataTableFilter2, DataTableAdvFilterSingleValue2, DataTableAdvFilterMultiValue2, DataTableAdvCustomFilter
- Spinner
- ControlledSwitch
- UncontrolledSwitch
- CellContentLoader, ChartLoader
- DateTime, DateTimeRelative, timeToString, timeToStringRelative, useDateFNSLocale
- saveToLS, getFromLS, removeFromLS
- validateAccess, validateTenantAccess, validateResourceAccess
- ErrorHandler
- Credentials, ButtonWithAuthz, LinkWithAuthz, ControlledSwitchWithAuthz, UncontrolledSwitchWithAuthz, isAuthorized
- ResultCard
- PubSubProvider, usePubSub
- ConsoleModeButton
- FullscreenButton
- AttentionBadge
- hexToString
- classifyIPAddress
- itemExtensionHandler
- removeFileExtension
- deepMerge
- Monaco helpers via optional entries (requires `monaco-editor` peer): import `asab_webui_components/monaco/setup` for MF workers, then `{ problemMarkers }` from `asab_webui_components/monaco`
- setBacklink, setBacklinkFromLocation, getBacklink, getBacklinkData, clearBacklink, consumeBacklink, consumeBacklinkData, createBacklinkHandlers
- AppStoreProvider, useAppStore, useAppSelector, createAppStore, registerReducer

## Documentation

### Monaco Editor setup

`asab_webui_components` does **not** bundle Monaco web workers. The consuming app's webpack build must emit the worker files and configure `MonacoEnvironment` as follows.

#### 1. Add `monaco-editor-webpack-plugin` to your webpack config

```js
// webpack.common.js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  plugins: [
    new MonacoWebpackPlugin({
      // List only languages this remote's editors use (keeps workers small).
      // Do not put `typescript` / `css` here unless you accept their large workers.
      languages: ['yaml'], // example - match this app's editors
    }),
  ],
};
```

The plugin emits these worker files next to your `remoteEntry.js` / `main.js` (only for languages you listed that need a worker):

| File | Language(s) |
|---|---|
| `editor.worker.js` | fallback for all unlisted languages |
| `json.worker.js` | JSON |
| `css.worker.js` | CSS, SCSS, Less |
| `html.worker.js` | HTML, Handlebars, Razor |
| `ts.worker.js` | TypeScript, JavaScript (language service) |

`javascript` in `languages` alone registers syntax highlighting and does **not** emit `ts.worker.js`. Only including `typescript` does.

`asab_webui_components/monaco/setup` maps known labels to these filenames at your build's `output.publicPath`; unmapped labels fall back to `editor.worker.js`.

#### 1b. Tree-shaking with Monaco ≥ 0.57

From Monaco 0.57, `import 'monaco-editor'` resolves to `esm/vs/index.js`, which side-effect-imports **all** languages (including TypeScript). That bypasses `MonacoWebpackPlugin({ languages })` and can pull in a multi‑MB `ts.worker` chunk even when `typescript` is not in your list.

The plugin only rewrites `editor.api` / `editor.main`. Point the package root at the exported editor API entry so filtering works:

```js
// webpack.common.js — resolve.alias
{
  // exported subpath → esm/vs/editor/editor.api.js (do not use monaco-editor/esm/vs/... under 0.57 package exports)
  'monaco-editor$': 'monaco-editor/editor/editor.api',
}
```

Keep this alias in every federated app that depends on `monaco-editor` (including builds that only pull Monaco via `asab_webui_components/monaco/setup`, which imports `monaco-editor`).

#### 2. Import the environment setup before using Monaco

```js
// In the lazily-loaded screen/module that uses Monaco — NOT in the app entry point
import 'asab_webui_components/monaco/setup';
```

Importing from the lazy entry keeps Monaco out of the initial bundle.

#### 3. Module Federation: do **not** share `monaco-editor`

Do **not** put `monaco-editor` in Module Federation `shared` (especially not as a singleton).
If remotes share one Monaco instance, only the first remote’s `languages[]` / workers apply - other remotes lose highlighting or pick up the wrong worker URLs.

Each Monaco remote should bundle its own Monaco with its own trimmed `languages[]`.
`import 'asab_webui_components/monaco/setup'` still configures workers for cross-origin remote `publicPath` vs the shell origin.

`MonacoEnvironment` is page-global. Because Monaco is not MF-shared, setup wraps that remote’s `monaco.editor.create` / `createDiffEditor` / `createModel` to rebind `getWorker` to this remote’s `publicPath` right before create — so remounting an editor (e.g. alerts) does not keep using another remote’s worker URLs. Two remotes with live editors at once can still race on a late worker spawn.
