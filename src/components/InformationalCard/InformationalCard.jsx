import React from 'react';
import { useTranslation } from "react-i18next";

import {
    Row, Col,
    Card, CardBody
} from 'reactstrap';

import './InformationalCard.scss';

const illustrations = {
    invalid: "/media/illustrations/invalid-route.svg",
    unauthorized: "/media/illustrations/unauthorized-access.svg",
    discover: "/media/illustrations/no-data.svg",
}

export function InformationalCard(props){
    const {type, title, textPrimary, text, resource} = props;
    const { t } = useTranslation();

    return(
        <Card className={`status-card ${type === "discover" && "bg-transparent border-0"}`}>
            <CardBody className="status-card-body">
                <Row className="status-row">
                    <Col className="status-col">
                        <div className="status-img-wrapper">
                            <img src={illustrations[type]} alt={t(title)}/>
                        </div>
                        { type === "unauthorized" && resource && <h5 className="status-card-title">{resource}</h5> }
                        { textPrimary && <h4 className="status-card-text">{ t(textPrimary) }</h4> }
                        <h6 className="status-card-text">{t(text)}</h6>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}
