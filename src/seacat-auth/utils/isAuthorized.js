import { useSelector } from 'react-redux';

/*
This component validates if the resource is suitable or not to grant access to parts of the application. If the isAuthorized returns true, the resource is valid.

isAuthorized has 1 argument:
	resourcesArray - array (this is an array of  resources required for the validation)

Usage:
	1. Import this component from asab-component-webui
		import { isAuthorized } from 'asab_webui_components';
	2. Put the component in a variable and pass an array of resources as an argent
		const invalidResource = isAuthorized(['some:resource']);
	3. Use this variable in the code.
		variable returns true or false
*/

export function isAuthorized(resourcesArray) {
	const resources = useSelector(state => state.auth?.resources || []);

	return resources.includes('authz:superuser') || resourcesArray.some(resource => resources.includes(resource));
}
