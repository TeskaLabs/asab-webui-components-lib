import React, { Component } from "react";
import { AsabReactJson } from "../components/AsabReactJson/AsabReactJson.jsx";

export class Renderer extends Component {
	// Renderer defaults
	constructor(app) {
		super(); // Call super() for React component initialization
		this.App = app;
	}

	render(key, value, schemaField) {
		// Render ReactJson component if value is a object
		if (typeof value === 'object') {
			return (
				<AsabReactJson
					src={value}
					name={false}
					collapsed={false}
					displayDataTypes={false}
					displayArrayKey={false}
					quotesOnKeys={false}
					enableClipboard={false}
					indentWidth={8}
				/>
			)
		}
		// Render span with value inside as a default
		return (<span>{(typeof value === "bigint") ? value.toString() : value}</span>);
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
