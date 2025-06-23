import React, { useState, useEffect } from 'react';
import { ControlledSwitch } from './ControlledSwitch/ControlledSwitch';

// documentation available in asab-webui/doc/switch-components.md

export const UncontrolledSwitch = ({
	defaultValue = false, disabled = false,
	title, register, setValue, name = 'uncontrolled switch', id,
	size = 'md'
}) => {
	const [isOn, setIsOn] = useState(defaultValue);

	useEffect(() => {
		setValue(name, isOn, { shouldDirty: true });
	}, [isOn]);

	return (
		<>
			<ControlledSwitch
				isOn={isOn}
				title={title}
				disabled={disabled}
				toggle={() => setIsOn(prev => !prev)}
				size={size}
			/>
			<input
				type="checkbox"
				name={name}
				id={id}
				ref={register}
				{...register(name)}
				style={{ display:"none" }}
			/>
		</>
	)
}
