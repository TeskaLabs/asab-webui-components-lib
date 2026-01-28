import { useTranslation } from 'react-i18next';

// Used for Button, Link and Switches with authz
export const authz = (childProps) => {
	const { t } = useTranslation();

	const { resource, resources, hideOnUnauthorizedAccess, disabled: disabledProp, title: titleProp } = childProps;

	let disabled = true;

	// Normalize `resource` to array for uniform handling
	const requiredResources = resource ? (Array.isArray(resource) ? resource : [resource]) : [];

	// Check if the user has at least one of the required resources. Also, if user has 'authz:superuser', always allow
	if (resources) {
		const isSuperUser = resources?.includes('authz:superuser');
		const hasRequiredResource = requiredResources.some(r => resources?.includes(r));
		disabled = !(isSuperUser || hasRequiredResource);
	}

	// Respect explicit disabled prop passed by developer
	if (disabledProp === true) {
		disabled = true;
	}

	// Determine if the element should be hidden when unauthorized
	const hide = Boolean(hideOnUnauthorizedAccess);
	// Remove prop to avoid React warnings about unknown attributes
	if (hideOnUnauthorizedAccess) {
		delete childProps.hideOnUnauthorizedAccess;
	}

	// Set the title for unauthorized state
	let title = titleProp;
	if (disabled) {
		title = t('General|You do not have access rights to perform this action');
	}

	return { disabled, hide, title };
}
