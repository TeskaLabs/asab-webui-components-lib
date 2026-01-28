import React from 'react';
import { authz } from '../../utils/authz';
import { UncontrolledSwitch } from './utils/UncontrolledSwitch';

/*
	UncontrolledSwitchWithAuthz component emulates the functionality of asab-webui <UncontrolledSwitch/> component
	and extend it by disable feature based on resources.

	* resource
		* the resource to distinguish access rights, e.g. yourproduct:yourcomponent:write

	* resources
		* the list of resources from the userinfo

	* hideOnUnauthorizedAccess
		* the option to hide the button completely instead of disabling it, default is false

	* Language localisations for generic `unauthorized message` can be added to the translation.json files of
	  public/locales/en & public/locales/cs of the product where component UncontrolledSwitchWithAuthz is used. The default
	  message is `You do not have rights` and it can be re-set in locales as e.g.

	  {
		"You do not have access rights to perform this action": "You do not have access rights to perform this action"
	  }

---

	Example:

	import { UncontrolledSwitchWithAuthz, useAppSelector } from 'asab_webui_components';

	...

	const resources = useAppSelector(state => state.auth?.resources);

	...

	return(
		...
			<UncontrolledSwitchWithAuthz
				title={t(`MyModule|${isDisabled ? "Enable" : "Disable"} file`)}
				size="sm"
				register={register}
				setValue={setValue}
				name='setTotp'
				resource="myapp:mylist:write"
				resources={resources}
				hideOnUnauthorizedAccess={true}
			/>
		...
	)

*/

export function UncontrolledSwitchWithAuthz(props) {
	let childProps = {...props}; // Create a new child component to have option to remove props
	const { disabled, title, hide } = authz(childProps);

	return (
		hide && disabled ? null :
		<UncontrolledSwitch
			{...childProps}
			title={title}
			disabled={disabled}
		/>
	)
}
