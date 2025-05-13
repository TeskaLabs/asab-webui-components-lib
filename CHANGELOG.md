# CHANGELOG for ASAB WebUI Components

## 25.2.12

- Create lmio and seacat-auth folder. Implement User. Replace Authz folder to seacat-auth. (#21)

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
