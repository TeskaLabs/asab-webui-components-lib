import { useTranslation } from 'react-i18next';

/*
	- Component responsible for handling and displaying error messages.
	- The 'error' prop is an object that contains the error message and any which contains a dictionary with variables, if any, in the error message.
	- Using "escapeValue: false" leaves the characters which would be normally escaped by i18n library in original form.
		In this case its mostly forward slashes provided within the error.
		More info can be found: https://www.i18next.com/translation-function/interpolation.
*/

export function ErrorHandler ({ error = {} }) {

	const { t } = useTranslation();

	if (error.error_dict) {
		error.error_dict['interpolation'] = { escapeValue: false };
	}

	return t(error.error, error.error_dict);
}
