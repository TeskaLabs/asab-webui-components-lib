import React from 'react';

import './ControlledSwitch.scss';

export const ControlledSwitch = ({ isOn, toggle, disabled=false, title, size='md' }) => {
	const onClick = () => {
		if (!disabled) {
			toggle();
		}
	}

	return (
		<div className={`seacat-auth switch-container${disabled ? "-disabled" : ""} ${size}`} title={title}>
			<div className={isOn ? "on" : "off"} onClick={onClick}>
				<div className="circle"></div>
			</div>
		</div>
	);
}
