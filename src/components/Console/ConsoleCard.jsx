import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';

import { ConsoleContext } from './ConsoleContext.jsx';
import './ConsoleCard.scss';

/*
	This component displays the console and provides the following functions:
		- Save the scroll position when new logs arrive and continue tracking new logs if the user scrolls all the way down.
		- Allow toggling between wrapped and unwrapped log content.

	Props:
	logs -  'array or string', required. Representing the logs to be displayed.
	header - 'component', optional. The header to be displayed at the CardHeader
	cardBodyClass - 'string', optional. Additional CSS classes for the CardBody element.
	shouldWrap - 'bool', optional. Initially makes text wrap
*/

export function ConsoleCard ({ logs, header, cardBodyClass = '', shouldWrap = false }) {
	const logEndRef = useRef(null); // Reference for scroll to the end of the logs

	const [isScrolledToBottom, setIsScrolledToBottom] = useState(true); // Indicates whether the card is scrolled to the bottom
	const [isContentWrapped, setIsContentWrapped] = useState(shouldWrap); // Toggles wrapping the console content

	// Auto-scroll to the bottom when new logs are added and user is already at the bottom
	useEffect(() => {
		if ((logs?.length > 0) && isScrolledToBottom) {
			scrollToBottom();
		}
	}, [logs, isScrolledToBottom]);

	// Scrolls the logs to the bottom
	const scrollToBottom = () => {
		logEndRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest'
		});
	};

	// Updates the state by tracking the scroll position
	const handleScroll = (event) => {
		const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
		// Reduced height for earlier trigger conditions, necessary for ease of use
		const reducedScrollHeight = scrollHeight - 10;
		const isAtBottom = Math.ceil(scrollTop + clientHeight) >= reducedScrollHeight;
		setIsScrolledToBottom(isAtBottom);
	};

	return (
		// Provide context values for content wrapping
		<ConsoleContext.Provider value={{ isContentWrapped, setIsContentWrapped }}>
			<Card className='h-100 application-console-card'>
				{header &&
					<CardHeader className='card-header-flex'>
						{header}
					</CardHeader>
				}
				<CardBody onWheel={handleScroll} className={`${cardBodyClass} application-console-card-body overflow-auto px-1 py-0`}>
					<pre className={`${isContentWrapped ? 'application-console-text-wrap' : ''} mb-0 h-100`}>
						{Array.isArray(logs) ? logs.map((log, index) => (
							<span key={index}>{log}</span>
						)) : <span>{logs}</span>}
						<span className='d-block' ref={logEndRef} />
					</pre>
				</CardBody>
			</Card>
		</ConsoleContext.Provider>
	);
}
