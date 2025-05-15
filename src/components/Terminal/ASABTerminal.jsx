import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
// import { useSelector } from 'react-redux';

import { Terminal } from '@xterm/xterm';  // Use @xterm/xterm package
import { FitAddon } from '@xterm/addon-fit';  // Import the FitAddon
import '@xterm/xterm/css/xterm.css'; // Import the xterm.css

/*

	TODO:

	- write README with usage (for websocket and for regular get API calls)
	- add styling based on theme
	- play with other setting

*/

export function ASABTerminal({ loader, loaderParams, header, cardBodyClass = '' }) {
	const terminalRef = useRef(null);
	const terminal = useRef(null);
	const fitAddon = useRef(new FitAddon()); // Initialize the FitAddon
	// const theme = useSelector((state) => state?.theme);


	useEffect(() => {
		// Initialize the terminal when the component mounts
		terminal.current = new Terminal({
			fontFamily: 'var(--bs-font-monospace)', // Font type
			fontSize: 14, // Font size
			convertEol: true,
			scrollback: 2000, // Max. number of lines displayed TODO: reconsider if use at all
		});

		// Open the terminal in the DOM element
		terminal.current.open(terminalRef.current);

		// Attach the FitAddon to the terminal
		terminal.current.loadAddon(fitAddon.current);

		// Fit the terminal to the container size
		fitAddon.current.fit();

		// Create ResizeObserver to track changes to the card's size
		const resizeObserver = new ResizeObserver(() => {
			fitAddon.current.fit(); // Resize the terminal when the container size changes
		});

		// Observe the terminal container
		if (terminalRef.current) {
			resizeObserver.observe(terminalRef.current);
		}

		// Cleanup on component unmount
		return () => {
			terminal.current.dispose();
			resizeObserver.disconnect();
		};
	}, []);

	// Fetch logs when the component mounts
	useEffect(() => {
		fetchLogs();
	}, [loader]);

	// Fetch logs or data using the loader from the parent component
	const fetchLogs = async () => {
		if (loader && terminal.current) {
			try {
				// Call the loader function passed from the parent and insert a terminal as a prop
				await loader({ terminal: terminal.current });
			} catch (e) {
				console.error('Unable to load Terminal logs:', e);
			}
		}
	};

	return (
		<Card className="h-100">
			{header && (
				<CardHeader className="card-header-flex">{header}</CardHeader>
			)}
			<CardBody className={`${cardBodyClass} overflow-hidden px-1 py-0`}>
				<div ref={terminalRef} className='h-100 w-100 px-1'></div>
			</CardBody>
		</Card>
	);
}
