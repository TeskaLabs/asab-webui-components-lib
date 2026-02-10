import i18next from 'i18next';

const t = i18next.t;

// Normalize item to the primitive value sent to the API (supports both string and { value, label/translationKey } shapes)
export const getFilterValue = (item) => (
	typeof item === 'object' && item !== null && 'value' in item ? item.value : item
);

// Display label: translationKey (i18n), or pre-translated label, or raw value
export const getFilterLabel = (item) => {
	if (typeof item === 'object' && item !== null) {
		if (item.translationKey) return t(item.translationKey);
		if (item.label != null) return item.label;
	}
	return item;
};
