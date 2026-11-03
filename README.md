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

**TODO**
