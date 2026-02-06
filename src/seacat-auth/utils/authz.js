import { useTranslation } from 'react-i18next';
// Used for Button and Switches with authz
export const authz = (childProps) => {
	const { t } = useTranslation();

	const {
		resources,
		resource,
		hideOnUnauthorizedAccess,
		disabled: disabledProp,
		title: titleProp,
	} = childProps;

	let disabled = true;

	// Check if the user has at least one of the required resources. Also, if user has 'authz:superuser', always allow
	const requiredResources = Array.isArray(resource) ? resource : [resource];

	// superuser always allow
	if (resources?.includes('authz:superuser')) {
		disabled = false;
	} else {
		// if at least one match is found — access is granted
		const resourcesSet = new Set(resources);
		disabled = !requiredResources.some(r => resourcesSet.has(r));
	}

	// If defined, hide the disabled button
	const hide = Boolean(hideOnUnauthorizedAccess);

	// Remove hideOnUnauthorized element from props to avoid react warnings
	if (hideOnUnauthorizedAccess) {
		delete childProps.hideOnUnauthorizedAccess;
	}

	// Set the title for unauthorized state
	let title = titleProp;
	if (disabled) {
		title = t('General|You do not have access rights to perform this action');
	}

	// Check on disabled eventually passed in the props
	if (disabledProp && (disabled === false)) {
		disabled = disabledProp;
	}

	return { disabled, hide, title };
};
