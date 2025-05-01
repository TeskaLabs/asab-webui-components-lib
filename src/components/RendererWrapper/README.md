# RendererWrapper

## Usage

### Wrap every renderer to a RendererWrapper component

```
import React from "react";
import { Renderer, RendererWrapper } from "asab_webui_components";

export class MyRenderer extends Renderer {
	render(key, value, schemaField, params = undefined) {
		// RendererWrapper can contain any property
		return <RendererWrapper
			data-value={value} // Passing value (to eventually work with in the external wrapper)
			data-key={key} // Passing key (to eventually work with in the external wrapper)
			component={params?.WrapperComponent || "span"}>
			{value}
		</RendererWrapper>;
	}

	plain(key, value, schemaField) {
		return value;
	}

}
```


### Overload the RendererWrapper with a custom rendering component by injecting it into the render params

**This part is OPTIONAL** - it is mandatory only if there is a need of transforming original Renderers.

- Create a custom rendering component:

```
function CustomRenderingComponent({ children, ...rest }) {

	// Do necessary data transformation or specify different rendering component

	const parentKey = rest?.['data-key']; // Retrieving the parent key
	const value = rest?.['data-value']; // Retrieveing the parent value
	if (value == undefined) {
		return <span>{children}</span>;
	}

	return(
		(parentKey === 'abc') ?
			<span>{children}</span>
		: <div className='m-4'>{children}</div>
	)
}
```

- Use a custom rendering component in the render section of the schema:

```
...

return (
	<span className='font-monospace'>
		{schema?.render(dataKey, dataValue, { WrapperComponent: CustomRenderingComponent })}
	</span>
);
```
