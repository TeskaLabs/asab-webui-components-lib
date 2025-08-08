# CHANGELOG for ASAB WebUI Components

## 25.6.3

- Add `ASABProgress` reusable component / progress bar (#43)

## 25.6.2

- Increase defensiveness in DataTable2 when rows are of unsupported type (#44)

## 25.6.1

- Remove `isoCodeCountries` lookup util. This has been moved into lmio_webui_components (#40)

## 25.5.1

- Remove TreeMenu and Console component. This has been moved into lmio_webui_components (#39)

## 25.4.3

- Update ResulCard styles. Card alignment on top of the screen (#37)

## 25.4.2

- Add `translateFromContent` utility function for handling multi-language content objects with language-specific text (#36)

## 25.4.1

- Move Authz folder to seacat-auth folder (#21)

## 25.3.3

- Refactor `timeToString` and `timeToStringRelative` methods to return just the value of time. (#34)

## 25.3.2

- Remove styles folder and move in to asab_webui_shell_lib (#31)

## 25.2.19

- Create a RendererWrapper component. (#19)
- Updated conditions for the `classyfyIPAddress` to check ip spalng objects with keys `h` and `l`. (#33)
- Update colors for Alerts (#11)

## 25.2.18

- Refactor IP address classification to comphrehend the value normalization and proper IP address classification. (#30)

## 25.2.17

- Add option to return `level` in TreeMenu. Add option to configure the TreeMenu over memoized paths on opened nodes. (#6)

## 25.2.16

- Add title for unauthorized access using LinkWithAuthz. (#29)

## 25.2.15

- Implemented more defensiveness in DateTime components to avoid application crashes when invalid datetime value is being injected. (#28)

## 25.2.14

- Refactor DateTime and RelativeDateTime components with unification of methods which can be reused. Update structure of DateTime section. Create timeToStringRelative method. Add option to RelativeDateTime to display/not display suffix. (#27)

## 25.2.13

- Increased visibility of hr separators (#26)

## 25.2.12

- Update babel.config to allow handling recent features like BigInt on compilation (#24)

## 25.2.11

- Replace isValidIP and isPrivateIP utils by classifyIPAddress feature which classifies the IP addresses (#23)

## 25.2.10

- Display biging values in the Renderer. Convert bigint to string (#22)

## 25.2.9

- Add splang format processing for DateTime (#17)

## 25.2.8

- ConsoleCard - Add a `shouldWrap` option to specify default wrapping (!20)

## 25.2.7

- Upgrade axios peer dependency to `^1.8.4` (!18)

## 25.2.6

- Added new component `AsabReactJson`. `ReactJson` in `Renderer.js` is replaced by `AsabReactJson` (!7)

## 25.2.5

- Add relative DateTime component that displays relative time and shows absolute time on hover (#16)

## 25.2.4

- Refactor timeToString react hook render issues by moving the locale hook out of the method (#13)

## 25.2.3

- Enable TreeMenu data obtainment based on loader params change, add a custom classname for treemenu card, add new colors to the palette (#10)

## 25.2.1

- Fix on problem markers

## 25.1.3

- Replace yarn with pnpm in github workflow (#3)

## 25.1.2

### Refactor

- Allow publish to npm only on tag build (#1)
