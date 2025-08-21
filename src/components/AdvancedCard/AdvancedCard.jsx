import React from 'react';
import ReactJsonView from '@microlink/react-json-view'
import { Card, CardHeader, CardBody } from 'reactstrap';
import { useAppSelector } from '../Context/store/AppStore.jsx';

// This is a card that displays data on the page in JSON format after hotkeys are pressed `ctrl + shift + 1`
export function AdvancedCard ({ data, cardClassname='' }) {
	const theme = useAppSelector(state => state.theme);
	const advmode = useAppSelector(state => state.advmode?.enabled);

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
					<ReactJsonView
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
