import React, { useState, useEffect, useRef } from 'react';
import { CardBody, CardHeader, Card } from 'reactstrap';
import { useLocation } from "react-router-dom";

import { usePubSub } from '../Context/PubSubContext';

import { TreeMenu } from './TreeMenu.jsx';
import { flattenTree } from './utils/flattenTree.jsx';

export const TreeMenuCard = ({ loader, header, hasSearch, rows,
	rowHeight = 21, cardClassName='', cardBodyClassName='',
	disableNodeMemorySession = false, memorySessionName = undefined,
	flatten = false, loaderParams = undefined, ...props }) => {
	const location = useLocation();
	// Getting application object and subscription from application PubSub
	const { app, subscribe } = usePubSub();
	const cardRef = useRef(null);
	const cardBodyRef = useRef(null);
	const [data, setData] = useState([]);
	const [limit, setLimit] = useState(0);
	const [isLoading, setLoading] = useState(true);
	const [savedOpenNodes, setSavedOpenNodes] = useState([]);

	useEffect(() => {
		loadTreeMenuData();
		/*
			Load open nodes from sessionStorage only when disabledNodeMemorySession is not true.
			This prop means that TreeMenu is already using the custom openNodes setting.
		*/
		if (!disableNodeMemorySession) {
			loadStoredOpenNodes();
		}
	}, [loaderParams]);

	// Reload based on specific PubSub message
	useEffect(() => {
		const subscription = subscribe('Application.reload!', (message) => {
			/*
				TODO: eventually use data passed from the published event to distinguish
				between reloaded components
			*/
			if (message?.mode === 'transparent') {
				// Use transparent reloading
				loadTreeMenuData({transparentReload: true});
			} else {
				loadTreeMenuData();
			}
		});

		// Clean up subscription on component unmount
		return () => {
			subscription();
		};
	}, []);

	// Updating localStorage when openNodes are changed and allowed to remain in storage
	useEffect(() => {
		if (!disableNodeMemorySession) {
			sessionStorage.setItem(memorySessionName || location.pathname, JSON.stringify(savedOpenNodes));
		}
	}, [savedOpenNodes]);

	useEffect(() => {
		if (cardRef.current && cardBodyRef.current) {
			const height = cardRef.current.parentElement.getBoundingClientRect().height;
			const cardBodyHeight = height - 55 // header overhead;
			cardBodyRef.current.style.height = `${cardBodyHeight}px`;

			const rows = Math.max(Math.floor((cardBodyHeight - 32 /* Card body padding */) / rowHeight), 5);
			setLimit(rows);
		}
	}, [cardRef]);

	const loadTreeMenuData = async ({ transparentReload = undefined } = {}) => {
		// Display loading placeholders when transparent reload is undefined
		if (!transparentReload) {
			setLoading(true);
		}
		try {
			const data = await loader();
			if (!flatten) {
				// Set data to the tree without flattening
				setData(data);
			} else {
				// Flat the tree and set data
				setData(flattenTree(data));
			}
		}
		catch (error) {
			app.addAlertFromException(error, 'Failed to load data to the tree menu');
		}
		finally {
			setLoading(false);
		}
	};

	// Getting open nodes from sessionStorage
	const loadStoredOpenNodes = () => {
		const storedOpenNodes = sessionStorage.getItem(memorySessionName || location.pathname);
		if (storedOpenNodes) {
			try {
				setSavedOpenNodes(JSON.parse(storedOpenNodes));
			} catch (error) {
				console.error(error);
				setSavedOpenNodes([]);
			}
		}
	};

	return (
		<Card className={`h-100 ${cardClassName}`} innerRef={cardRef}>
			{(header) &&
				<CardHeader className='card-header-flex'>
					{header}
				</CardHeader>
			}
			<CardBody innerRef={cardBodyRef} style={{ overflow: 'auto'}} className={cardBodyClassName}>
				<TreeMenu
					data={data}
					hasSearch={hasSearch} // This prop enables Search in TreeMenu2
					limit={limit}
					isLoading={isLoading}
					savedOpenNodes={savedOpenNodes}
					setSavedOpenNodes={setSavedOpenNodes}
					{...props}
				/>
			</CardBody>
		</Card>
	);
};
