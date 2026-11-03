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
      // list only the languages your app uses; keeping this list small reduces bundle size
      languages: ['json', 'javascript', 'typescript', 'css', 'html'],
    }),
  ],
};
```

The plugin emits these worker files next to your `remoteEntry.js` / `main.js`:

| File | Language(s) |
|---|---|
| `editor.worker.js` | fallback for all unlisted languages |
| `json.worker.js` | JSON |
| `css.worker.js` | CSS, SCSS, Less |
| `html.worker.js` | HTML, Handlebars, Razor |
| `ts.worker.js` | TypeScript, JavaScript |

`asab_webui_components/monaco/setup` expects these exact filenames at your build's `output.publicPath`.

#### 2. Import the environment setup before using Monaco

```js
// In the lazily-loaded screen/module that uses Monaco — NOT in the app entry point
import 'asab_webui_components/monaco/setup';
```

Importing from the lazy entry keeps Monaco out of the initial bundle.

#### 3. Module Federation: shared singleton

Mark `monaco-editor` as a shared singleton so all remotes share one instance:

```js
// webpack.common.js  — ModuleFederationPlugin shared section
shared: {
  'monaco-editor': { singleton: true, requiredVersion: packageJson.dependencies['monaco-editor'] },
}
```

The `monaco/setup` entry handles the cross-origin worker bootstrapping that is required when the singleton is served from a different remote origin than the shell app.
