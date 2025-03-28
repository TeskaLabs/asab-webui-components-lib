import React, { Component } from "react";
import ReactJson from 'react-json-view';
import { RendererWrapper } from '../components/RendererWrapper.jsx';

export class Renderer extends Component {
	// Renderer defaults
	constructor(app) {
		super(); // Call super() for React component initialization
		this.App = app;
	}

	render(key, value, schemaField, params = undefined) {
		// Render ReactJson component if value is a object
		if (typeof value === 'object') {
			const theme = this.App.Store.getState().theme;
			return (<ReactJson
					src={value}
					name={false}
					collapsed={false}
					displayDataTypes={false}
					displayArrayKey={false}
					quotesOnKeys={false}
					enableClipboard={false}
					indentWidth={8}
					theme={theme === 'dark' ? "chalk" : "rjv-default"}
				/>)
		}

		// Render span with value inside as a default
		return (<RendererWrapper
				data-value={value} // Passing value (to eventually work with in the external wrapper)
				data-key={key} // Passing key (to eventually work with in the external wrapper)
				component={params?.WrapperComponent || "span"}
				>{value}</RendererWrapper>);
	}

	plain(key, value, schemaField)	{
		// Render stringified component if value is a object
		if (typeof value === 'object') {
			try {
				return JSON.stringify(value);
			} catch(e) {
				console.warn('Failed to stringify the renderer value:', value, e);
				return value;
			}
		}
		return value;
	}
}
