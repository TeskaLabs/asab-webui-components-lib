# Progress component (ASABProgress)

- display progress bar with value in percents on the right (default behavior)

## Usage

```jsx
import { ASABProgress } from 'asab_webui_components';

return <ASABProgress value={progressValue}/>
```

- for displaying without numeric value %, use `showPercentage={false}` prop

- accepts {children} prop, will be displayed in the middle of "progressed" part of bar (```<ASABProgress>Child Here...</ASABProgress>```)

- Invalid values handled, clamping and rounding happens in the component

- Uses Reactstrap's Progress, accepts same props
