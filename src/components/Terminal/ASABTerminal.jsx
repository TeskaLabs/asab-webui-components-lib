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
	- extend by option to write (and send) commands within the terminal (in future iterations)

*/

export function ASABTerminal({ loader, loaderParams, handleTypingAndProcessCommand, header, cardBodyClass = '' }) {
	const terminalRef = useRef(null);
	const terminal = useRef(null);
	const fitAddon = useRef(new FitAddon()); // Initialize the FitAddon
	// const theme = useSelector((state) => state?.theme);


	useEffect(() => {
		// Initialize the terminal when the component mounts
		terminal.current = new Terminal({
			fontFamily: 'var(--bs-font-monospace)', // Font type
			fontSize: 14, // Font size
			lineHeight: 1.2, // Optimal line height for 14 fontsize and monospace font family
			convertEol: true, // Enable automatic conversion of \r to \n (converting end of line)
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

		// Row padding of the terminal
		if (terminalRef.current) {
			const terminalRows = terminalRef.current.querySelector('.xterm-rows');
			if (terminalRows) {
				terminalRows.style.paddingLeft = '10px';
			}
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
	}, [loaderParams]);

	// Fetch logs or data using the loader from the parent component
	const fetchLogs = async () => {
		if (loader && terminal.current) {
			try {
				// Call the loader function passed from the parent and insert a terminal as a prop
				await loader({ terminal: terminal.current, loaderParams });
			} catch (e) {
				console.error('Unable to load Terminal logs:', e);
			}
		}
	};

// 		  // Handle input typed in the terminal
  // const handleInput = (data) => {
  //   if (handleTyping) {
  //     // Process the input by calling the handleTyping function from the parent component
  //     handleTyping(data);
  //   } else {
  //     // If handleTyping is not passed, show a message that typing is disabled
  //     terminal.current.write('\r\nTyping is not enabled.\r\n');
  //   }
  // };

  // // Enable typing when the handleTyping prop is provided (enabled by parent)
  // useEffect(() => {
  //   if (handleTyping) {
  //     terminal.current.onData(handleInput); // Listen for data and pass it to handleTyping
  //   } else {
  //     terminal.current.offData(handleInput); // If no handleTyping, disable data processing
  //   }
  // }, [handleTyping]); // Re-run this effect when handleTyping changes



// function runFakeTerminal() {
//     if (terminal._initialized) {
//       return;
//     }

//     terminal._initialized = true;

//     terminal.prompt = () => {
//       term.write('\r\n$ ');
//     };

//     // TODO: Use a nicer default font
//     terminal.writeln([
//       '    Xterm.js is the frontend component that powers many terminals including',
//       '                           \x1b[3mVS Code\x1b[0m, \x1b[3mHyper\x1b[0m and \x1b[3mTheia\x1b[0m!',
//       '',
//       ' ┌ \x1b[1mFeatures\x1b[0m ──────────────────────────────────────────────────────────────────┐',
//       ' │                                                                            │',
//       ' │  \x1b[31;1mApps just work                         \x1b[32mPerformance\x1b[0m                        │',
//       ' │   Xterm.js works with most terminal      Xterm.js is fast and includes an  │',
//       ' │   apps like bash, vim and tmux           optional \x1b[3mWebGL renderer\x1b[0m           │',
//       ' │                                                                            │',
//       ' │  \x1b[33;1mAccessible                             \x1b[34mSelf-contained\x1b[0m                     │',
//       ' │   A screen reader mode is available      Zero external dependencies        │',
//       ' │                                                                            │',
//       ' │  \x1b[35;1mUnicode support                        \x1b[36mAnd much more...\x1b[0m                   │',
//       ' │   Supports CJK 語 and emoji \u2764\ufe0f            \x1b[3mLinks\x1b[0m, \x1b[3mthemes\x1b[0m, \x1b[3maddons\x1b[0m,            │',
//       ' │                                          \x1b[3mtyped API\x1b[0m, \x1b[3mdecorations\x1b[0m            │',
//       ' │                                                                            │',
//       ' └────────────────────────────────────────────────────────────────────────────┘',
//       ''
//     ].join('\n\r'));

//     terminal.writeln('Below is a simple emulated backend, try running `help`.');
//     addDecoration(term);
//     prompt(term);

//     term.onData(e => {
//       switch (e) {
//         case '\u0003': // Ctrl+C
//           term.write('^C');
//           prompt(term);
//           break;
//         case '\r': // Enter
//           runCommand(term, command);
//           command = '';
//           break;
//         case '\u007F': // Backspace (DEL)
//           // Do not delete the prompt
//           if (term._core.buffer.x > 2) {
//             term.write('\b \b');
//             if (command.length > 0) {
//               command = command.slice(0, command.length - 1);
//             }
//           }
//           break;
//         default: // Print all other characters for demo
//           if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
//             command += e;
//             term.write(e);
//           }
//       }
//     });


// 	// Handle input typed in the terminal
  // const handleInput = (data) => {
  //   if (handleTypingAndProcessCommand) {
  //     if (data === '\r') {
  //       // // If Enter is pressed, process the full command
  //       // const fullCommand = terminal.current._core.buffer.getLine(terminal.current._core.buffer.ybase); // Get the full line of input
  //       // handleTypingAndProcessCommand(fullCommand, true);  // Command submission
  //     } else {
  //       handleTypingAndProcessCommand(data, false);  // Regular typing
  //       terminal.current.write(data);  // Display typed text in the terminal
  //     }
  //   } else {
  //     terminal.current.write('\r\nTyping is not enabled.\r\n');
  //   }
  // };

  // // Enable or disable typing when the handleTypingAndProcessCommand prop is provided (enabled by parent)
  // useEffect(() => {
  // 	if (terminal.current) {
// 	  	console.log(handleTypingAndProcessCommand, "TOOOOOKK")
// 	    if (handleTypingAndProcessCommand) {
// 	      terminal.current.focus(); // Enable typing by focusing on the terminal
// 	      terminal.current.onData(handleInput); // Listen for data and pass it to handleTypingAndProcessCommand
// 	      terminal.current.write('\r\n$\r\n');
// 	    } else {
// 	      terminal.current.blur(); // Disable typing by blurring the terminal (no cursor, no input)
// 	      // Don't add onData listener when typing is disabled
// 	    }
// 	}
  // }, []);

	return (
		<Card className="h-100">
			{header && (
				<CardHeader className="card-header-flex">{header}</CardHeader>
			)}
			<CardBody className={`${cardBodyClass} overflow-hidden px-1 py-0`}>
				<div ref={terminalRef} className='h-100 w-100'></div>
			</CardBody>
		</Card>
	);
}
