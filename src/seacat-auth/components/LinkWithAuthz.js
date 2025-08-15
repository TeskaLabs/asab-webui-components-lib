import React from 'react';
import { Link } from 'react-router-dom';
import { authz } from '../utils/authz';


/*
	LinkWithAuthz component creates a link that is enabled or disabled based on the user's authorized resources.

	* resource
		* resource required for the link to be active, e.g. "yourproduct:yourcomponent:access"

	* resources
		* list of the user's authorized resources

---

	Example:

	import { LinkWithAuthz, useAppSelector } from 'asab_webui_components';

	...

	const resources = useAppSelector(state => state.auth?.resources);
	const roleAccessResource = "any:role:access";

	...

	return(
		...
		<LinkWithAuthz
			resource={roleAccessResource}
			resources={resources}
			to={`/auth/roles/${role}`}
		>
			{role}
		</LinkWithAuthz>
		...
	)

*/

export function LinkWithAuthz(props) {
	let childProps = {...props};
	let authzObj = authz(childProps);
	const disabled = authzObj.disabled;
	const title = authzObj.title;

	return (
		disabled ? 
			<span title={title} {...childProps}>{childProps.children}</span>
		:
			<Link {...childProps}>{childProps.children}</Link>
	)
}
