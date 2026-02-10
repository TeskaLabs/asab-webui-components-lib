{/*
	Example of usage:
		<DataTableAdvFilterMultiValue2
			field={{ 'assignment.assigned': t('CredentialsRolesCard|Assignment') }}
			fieldItems={[
				{ value: 'true', label: t('CredentialsRolesCard|Assigned') },
				{ value: 'false', label: t('CredentialsRolesCard|Not assigned') },
				{ value: 'any', label: t('CredentialsRolesCard|All') },
			]}
		/>
*/}


// Normalize item to the primitive value sent to the API (supports both string and { value, label/translationKey } shapes)
export const getFilterValue = (item) => (
	typeof item === 'object' && item !== null && 'value' in item ? String(item.value) : String(item)
);

// Display label: translationKey (i18n), or pre-translated label, or raw value
export const getFilterLabel = (item) => (
	typeof item === 'object' && item !== null && 'label' in item ? item.label : item
);
