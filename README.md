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
- setBacklink, setBacklinkFromLocation, getBacklink, getBacklinkData, clearBacklink, consumeBacklink, consumeBacklinkData, createBacklinkHandlers
- AppStoreProvider, useAppStore, useAppSelector, createAppStore, registerReducer
- Monaco helpers (optional `monaco-editor` peer): see **[`src/monaco/README.md`](src/monaco/README.md)** - webpack, Module Federation, `initialize`, `loadLanguage`, examples

## Documentation

### Monaco Editor

Setup, webpack (`MonacoWebpackPlugin`, `editor.api` alias), Module Federation rules, React usage, and PoC examples are documented in **[`src/monaco/README.md`](src/monaco/README.md)**.
