# ASAB WebUI Backlink Utility

Store and retrieve navigation "back" URLs using sessionStorage.

## API

### `setBacklink(key, pathname, search?, options?)`
Store a URL to return to later.

### `setBacklinkFromLocation(key, location, searchParams?, options?)`
Same, but using React Router's location object.

### `consumeBacklink(key)` / `consumeBacklinkData(key)`
Get stored URL and remove it from session storage (one-time read, React Strict Mode safe).

### `getBacklink(key)` / `getBacklinkData(key)`
Get stored URL without removing it from session storage.

### `clearBacklink(key)`
Manually remove a stored backlink.

### `createBacklinkHandlers(key)`
Factory for pre-bound handlers.

## Usage

**Store before navigating away:**
```jsx
import { setBacklink } from 'asab_webui_components';

const handleClick = () => {
  setBacklink('SomeScreen', location.pathname, location.search);
  navigate('/somescreen/edit');
};
```

**Consume on mount:**
```jsx
import { consumeBacklink } from 'asab_webui_components';

useEffect(() => {
  const backUrl = consumeBacklink('SomeScreen');
  if (backUrl) setReturnTo(backUrl);
}, []);
```

**With React Router location:**
```jsx
import { setBacklinkFromLocation } from 'asab_webui_components';

setBacklinkFromLocation('SomeScreen', location);
```

**Using the factory (avoids repeating the key):**
```jsx
import { createBacklinkHandlers } from 'asab_webui_components';

// Create once, use multiple times without repeating 'SomeScreen'
const backlink = createBacklinkHandlers('SomeScreen');

backlink.setFromLocation(location); // stores under 'SomeScreen'
const url = backlink.consume(); // retrieves from 'SomeScreen'
backlink.clear(); // removes 'SomeScreen'
```
