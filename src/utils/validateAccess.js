/*

	Function for configuration validation with current tenant

	It will work only when Tenant/Auth module is loaded in the application
	It require tenant, resources and content of configuration
	The content has to be of type `object` (not array of objects)
	It returns `false` if content does not match validation criteria on tenant
	It returns `true` if content match the validation criteria on tenant

	Example of usage in the configuration:

	```
		"Authorization" {
			"tenants": "tenant1, tenant2",
			"resource": "some:resource"
		}
	```

	Example of usage within the code:

	```
	...


		if (content && Object.keys(content).length > 0) {

			...

			// This part will manage if the content is suitable for further processing
			if (validateAccess(tenant, resource, content)) {
				return;
			}

			// or only for tenant validation

			if (validateTenantAccess(tenant, content)) {
				return;
			}

			// or only for resource validation

			if (validateResourceAccess(resource, content)) {
				return;
			}

			// Processing content which passed the authorization criteria
			...
		}
	```

	Example of config for validateAccess function

	```
		...

		let config = {
				...

				"SectionName:datasource" {
					...
				},
				"Authorization" {
					"tenants": "tenant1, tenant2",
					"resource": "some:resource"
				},
				...
			}

		if (validateAccess(tenant, resource, content)) {
			return;
		}
		...

	```

	The result of processing after validation should be that the content, which has specified tenants (and/or) resource
	in the configuration and does match the criterion (match the configured tenants/resource in the `Authorization`
	section with current tenant/resources of the user), will be visible only to the users, whos current tenant/resources matches
	the criteria.

	Superuser is always validated for particular tenant

*/

export const validateAccess = (tenant, resources, content) => {
	const invalidTenant = validateTenantAccess(tenant, content);
	const invalidResource = validateResourceAccess(resources, content);
	return invalidTenant || invalidResource;
}

export const validateTenantAccess = (tenant, content) => {
	// Check if current tenant exist
	if (tenant != undefined) {
		// Get object with authorization setup (if defined in the content)
		const authSection = Object.keys(content).filter(res => (res == "Authorization"));
		//  Check if authorization section is present within the content
		if (content[authSection[0]]) {
			let tenantsSplit = content[authSection[0]]?.tenants ? content[authSection[0]]?.tenants.toString().split(",") : [""];
			let tenantsArray = [];
			tenantsSplit.map(value => {
				// Check if there is a whitespace in the first position of the string, and if so, erase that
				if(value.substring(0,1) == " ") {
					tenantsArray.push(value.substring(1));
				} else {
					tenantsArray.push(value);
				}
			})
			if (tenantsArray[0] != "" && tenantsArray.indexOf(tenant) == -1) {
				return true;
			}
		}
		return false;
	}
	return false;
}

export const validateResourceAccess = (resources, content) => {
	// Check if resources are present
	if (resources != undefined) {
		// Get object with authorization setup (if defined in the content)
		const authSection = Object.keys(content).filter(res => (res == "Authorization"));
		// Check if authorization section is present within the content
		if (content[authSection[0]]) {
			const resource = content[authSection[0]]?.resource ? content[authSection[0]].resource : undefined;
			if (resource && (resource != "") && (resources.indexOf(resource) == -1) && (resources.indexOf("authz:superuser") == -1)) {
				return true;
			}
		}
		return false;
	}
	return false;
}
