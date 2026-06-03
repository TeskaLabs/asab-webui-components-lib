import React from 'react';
import { AsabReactJson } from "../AsabReactJson/AsabReactJson.jsx";
import { Card, CardHeader, CardBody } from 'reactstrap';
import { useAppSelector } from '../Context/store/AppStore.jsx';

// This is a card that displays data on the page in JSON format after hotkeys are pressed `ctrl + shift + 1`
export function AdvancedCard ({ data, cardClassname='' }) {
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
					<AsabReactJson
						src={data}
						collapse={false}
					/>
				</CardBody>
			</Card>
		:
			null
	)
}
