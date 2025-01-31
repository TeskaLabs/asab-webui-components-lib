# CHANGELOG for ASAB WebUI Components

## v24.47

### Releases

- v24.47-alpha31
- v24.47-alpha30
- v24.47-alpha21
- v24.47-alpha17
- v24.47-alpha16
- v24.47-alpha10
- v24.47-alpha9
- v24.47-alpha8
- v24.47-alpha3

### Refactor

- Make message rendering in `problemMarkers` more performant (!493, INDIGO Sprint 241220, v24.47-alpha31)
- Add fallback on undefined endColumn of problem markers (!471, INDIGO Sprint 241122, v24.47-alpha17)
- Add possiblity for additional styling by adding a custom class to `CellContentLoader` (!441, INDIGO Sprint 241108, v24.47-alpha8)

### Features

- Update default Generic renderer to have a fallback on values which are objects (!475, INDIGO Sprint 241122, v24.47-alpha21)
- Create reusable `problemMarkers` monaco editor util which returns the list of the problem markers (!467, INDIGO Sprint 241122, v24.47-alpha16)
- Create `FullscreenButton` that can be added to components to trigger fullscreen mode (!444, INDIGO Sprint 241108, v24.47-alpha9)
- Modify datatable's advanced filtering, so that title in Dropdown and Badges are aligned and readable for the user (!426, INDIGO Sprint 241108, v24.47-alpha3)


### Bugfix

- Fix on incorrect condition in problem markers util when rendering the end column value (!492, INDIGO Sprint 241220, v24.47-alpha30)
- Update `@import` to `@use` to eliminate sass-related warning (!443, INDIGO Sprint 241122, v24.47-alpha10)

## v24.43

### Releases

- v24.43-alpha7
- v24.43-alpha4
- v24.43-alpha1

### Breaking changes

- ASAB Config WebUI `v24.43-alpha1` and higher requires LM.io Common Library `v24.40-alpha3` or higher

### Refactor

- Refactor Input select of Configuration to be compatible with new schema for default values and selection dropdown values (the selection dropdown values should be added into `enum` part of the schema) (!428, INDIGO Sprint 241004, v24.43-alpha1)

### Features

- Add styling for fullscreen card mode (!439, INDIGO Sprint 241030, v24.43-alpha7)

### Bugfix

- Refactor `isValidIP` to a function that manually checks the structure of IP addresses instead of using regex expression (!436, INDIGO Sprint 241004, v24.43-alpha4)

## v24.38

### Releases

- v24.38-alpha22
- v24.38-alpha21
- v24.38-alpha18
- v24.38-alpha10
- v24.38-alpha3
- v24.38-alpha2

### Refactor

- Rename `TerminalCard` component to `ConsoleCard` (!430, INDIGO Sprint 241004, v24.38-alpha21)

### Features

- Implemented `rowStyle` prop for DataTable2, add info to documentation about new prop (!407, INDIGO Sprint 241004, v24.38-alpha18)
- Add function `isValidIP` that checks if a given IP address is valid (!403, INDIGO Sprint 240913, v24.38-alpha10)
- Add Tree menu documentation. Renamed `flatTree` => `flatten`  (!406, INDIGO Sprint 240913, v24.38-alpha3)
- Implement Attention required badge (!390, INDIGO Sprint 240913, v24.38-alpha2)

### Refactor

- Update Credentials component, display userName without SeaCatAdminFederationModule (!423, INDIGO Sprint 241004, v24.38-alpha22)
- Updated `formatIntoTree` function, added sorting nodes (!424, INDIGO Sprint 241004, v24.38-alpha20)

## v24.34

### Releases

- v24.34-alpha14
- v24.34-alpha9
- v24.34-alpha3
- v24.34-alpha2

### Feature

- Add Tree menu util removeTreeContent  that hides folders and files specified in it and new formated data functions `formatIntoTree` and `formatIntoLeafTree` (!392, INDIGO Sprint 240830, v24.34-alpha9)
- Add Tree menu util and prop which will flatten the Tree menu structure (!358, INDIGO Sprint 240816, v24.34-alpha2)

### Refactor

- Change background and font color of the `TerminalCard` (!401, INDIGO Sprint 240913, v24.34-alpha14)
- Change font color of info alert, button and badge in dark mode to make it more visible (!380, INDIGO Sprint 240802, v24.34-alpha3)

## v24.28

## Releases

- v24.28-alpha29
- v24.28-alpha28
- v24.28-alpha23
- v24.28-alpha16
- v24.28-alpha11
- v24.28-alpha10
- v24.28-alpha8
- v24.28-alpha1

### Refactor

- Prevent wrapping of timestamp onto a new line in `DateTime` component (!349, INDIGO Sprint 240621, v24.28-alpha1)

### Features

- Add list of country ISO codes with their corresponding full names (!351, INDIGO Sprint 240719, v24.28-alpha29)
- Implement `removeFileExtension` component for removing extension (!374, INDIGO Sprint 240802, v24.28-alpha28)
- Implement saving of open nodes in TreeMenu to sessionStorage (!337, INDIGO Sprint 240719, v24.28-alpha23)
- Add function `isPrivateIP` that checks if a given IP address is private (!350, INDIGO Sprint 240621, v24.28-alpha11)
- Implement `TerminalCard` component (!276, INDIGO Sprint 240621, v24.28-alpha10)
- Implement option to specify `disableParams` property to use state to store parameters of DataTable2 instead of usage of searchParams. (!338, INDIGO Sprint 240621, v24.28-alpha8)
- Implement deepMerge util component. (!338, INDIGO Sprint 240621, v24.28-alpha8)

### Bugfix

- Fix deprecation warning in stylesheet regarding nested rules (!366, INDIGO Sprint 240719, v24.28-alpha16)

## v24.19

### Releases

- v24.19-alpha29
- v24.19-alpha28
- v24.19-alpha22
- v24.19-alpha18
- v24.19-alpha12
- v24.19-alpha10
- v24.19-alpha8

### Features

- Add `hexToString` function that convertes a hexadecimal string into its corresponding ASCII string (!334, INDIGO Sprint 240607, v24.19-alpha29)
- Set width of the columns based on the content in the DataTable2 (!249, INDIGO Sprint 240607, v24.19-alpha22)
- Implement `itemExtensionHandler` function (!253, INDIGO Sprint 240607, v24.19-alpha18)
- Implement `isResourceValid` function. Create utils folder and replace `authz.js`, updated paths for import `authz.js` (!302, INDIGO Sprint 240527, v24.19-alpha8)

### Refactor

- Updated pagination callback in `DataTable2` if no count comes. (!330, INDIGO Sprint 240621, v24.19-alpha28)
- Rename `ErrorMessageHandler` to `ErrorHandler` (!299, INDIGO Sprint 240527, v24.19-alpha12)
- Rename `isResourceValid` to `isAuthorized` (!317, INDIGO Sprint 240527, v24.19-alpha10)

## v24.08

- v24.08-alpha46
- v24.08-alpha45
- v24.08-alpha40
- v24.08-alpha35
- v24.08-alpha32
- v24.08-alpha22
- v24.08-alpha19
- v24.08-alpha15
- v24.08-alpha11
- v24.08-alpha10
- v24.08-alpha9
- v24.08-alpha1

### Features

- Add application object into the Renderer constructor (!287, INDIGO Sprint 240430, v24.08-alpha45)
- Implement PubSub messaging, create package.json file to share PubSub messages and functions accross applications (!244, INDIGO Sprint 240411, v24.08-alpha40)
- Implement print styles for DataTable2 (!245, INDIGO Sprint 240411, v24.08-alpha35)
- Implement AdvancedCard component (!238, INDIGO Sprint 240315, v24.08-alpha19)

### Refactor

- Change card header color to text color so it does not resemble a clickable link (!284, INDIGO Sprint 240430, v24.08-alpha46)
- Move local styling of the monaco hover from `asab_library_webui` and `lmio_parser_builder_webui` to `asab_webui_components` (!257, INDIGO Sprint 240402, v24.08-alpha32)
- ErrorMessageHandler moved to asab-component-webui from bs-query-webui (!231, INDIGO Sprint 240315, v24.08-alpha22)
- Move the access validation with `validateAccess` to be imported from ASAB WebUI instead of handling it locally (!228, INDIGO Sprint 240301, v24.08-alpha15)
- Change height of ResultCard and remove top margin to prevent scrolling (!122, INDIGO Sprint 240216, v24.08-alpha10)
- Unify `parseInt` in the DataTable2. Create `parseParam` function. Overflow-x style correction for the DataTableCard2 (!225, INDIGO Sprint 240301, v24.08-alpha9)
- The obsolete TreeMenu has been completely replaced by the new TreeMenu. TreeMenu2 is renamed to TreeMenu and the old code is removed. Add ability to add custom FolderIcon and FileIcon (!117, INDIGO Sprint 240216, v24.08-alpha1)

### Bugfix

- Remove button border of outline buttons in dropdowns (!227, INDIGO Sprint 240301, v24.08-alpha11)

## v24.03

### Releases

- v24.03-alpha17
- v24.03-alpha13
- v24.03-alpha3

### Features

- Update DataTable with alternative approach of retreiving data from loader method using setRows and setCount hooks (!181, INDIGO Sprint 240119, v24.03-alpha17)

### Refactor

- Refactor error message to avoid duplication (!199, INDIGO Sprint 240105, v24.03-alpha16)
- Refactor Humanize component - change naming to "Invalid value", correct validation of value, add non-breaking space before unit (!184, INDIGO Sprint 240119, v24.03-alpha13)
- Refactor reusable ResultCard so that the redirection will take the user to the present screen (!163, INDIGO Sprint 240105, v24.03-alpha3)

## v23.48

### Releases

- v23.48-alpha36
- v23.48-alpha35
- v23.48-alpha34
- v23.48-alpha29
- v23.48-alpha24
- v23.48-alpha20
- v23.48-alpha15
- v23.48-alpha14
- v23.48-alpha10
- v23.48-alpha9
- v23.48-alpha5

### Features

- Implement TreeMenuCard component (!169, INDIGO Sprint 240105, v23.48-alpha34)
- Add new prop `reload` for updating data in the DataTable2 (!156, INDIGO Sprint 240105, v23.48-alpha29)
- Implement route replace on DataTable initialization to avoid removal of search parameters when navigating back in browser's history to initial state (!157, INDIGO Sprint 231208, v23.48-alpha20)
- Implement advanced filtering to DataTable2, refactor serialization of the search parameters in the browser and in REST API request (!96, INDIGO Sprint 231124, v23.48-alpha15)
- Create resusable ResultCard, to give user information about successful/unsuccessful change (!147, INDIGO Sprint 231124, v23.48-alpha14)
- Implement option to specify own datetime format in DateTime component (!142, INDIGO Sprint 231124, v23.48-alpha5)

### Refactor

- Remove demo part (!126, INDIGO Sprint 231124, v23.48-alpha10)

- Refactor x-icons for deleting to trash-icons (!133, INDIGO Sprint 231110, v23.48-alpha9)

- Refactor Humanize component to import a new component which will return value as a string (!171, INDIGO Sprint 240105, v23.48-alpha35)

### Bugfix

- Implement fallback when URL limit parameter is missing/invalid in DataTable2 (!179, INDIGO Sprint 240105, v23.48-alpha36)
- Add missing name attribut to inputs (!162, INDIGO Sprint 231208, v23.48-alpha24)

## v23.45

### Releases

- v23.45-alpha5
- v23.45-alpha1

### Breaking changes

- After migration from react-router-dom v5 to react-router-dom v6, some of the routing components are not being supported. For more info, please see https://reactrouter.com/en/main/upgrading/v5

### Features

- Implement addAlertFromException method to render additional information from exceptions in Alert message (!106, INDIGO Sprint 231110, v23.45-alpha6)
- Migrate react-router-dom from v5 to v6 (!98, INDIGO Sprint 231027, v23.45-alpha1)

### Refactor

- Refactor implementation of bootstrap placeholder and change of its background color (!127, INDIGO Sprint 231110, v23.45-alpha5)

## v23.44

### Releases

- v23.44-alpha11
- v23.44-alpha9
- v23.44-alpha8
- v23.44-alpha7
- v23.44-alpha6
- v23.44-alpha3

### Refactoring

- Refactor ContentLoader to prevent from having negative values in viewBox (!97, INDIGO Sprint 231027, v23.44-alpha3)

- Change color of primary button :active state (!113, INDIGO Sprint 231027, v23.44-alpha6)

- Refactor disabled button pointer events to show title (!118, INDIGO Sprint 231027, v23.44-alpha7)

- Refactor react-content-loader to Bootstrap placeholder (!121, INDIGO Sprint 231027, v23.44-alpha8)

- Refactor theme-print styles (!55, INDIGO Sprint 231027, v23.44-alpha9, v23.44-alpha11)
