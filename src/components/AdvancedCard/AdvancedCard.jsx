import React from 'react';
import { useSelector } from 'react-redux';
import ReactJson from 'react-json-view';
import { Card, CardHeader, CardBody } from 'reactstrap';

// This is a card that displays data on the page in JSON format after hotkeys are pressed `ctrl + shift + 1`
export function AdvancedCard ({ data, cardClassname='' }) {
	const theme = useSelector(state => state.theme);
	const advmode = useSelector(state => state.advmode?.enabled);

	return (
		advmode ?
			<Card className={`${cardClassname}`}>
				<CardHeader className='card-header-flex'>
					<div className='flex-fill'>
						<h3>
							<i className='bi bi-code-slash pe-2' />
							JSON
						</h3>
					</div>
				</CardHeader>
				<CardBody>
					<ReactJson
						src={data}
						theme={(theme === 'dark') ? 'chalk' : 'rjv-default'}
						name={false}
						collapsed={false}
					/>
				</CardBody>
			</Card>
		:
			null
	)
}
