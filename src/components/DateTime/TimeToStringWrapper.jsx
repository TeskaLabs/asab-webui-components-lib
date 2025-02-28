import useDateFNSLocale from './useDateFNSLocale';
import timeToString from './timeToString';

const TimeToStringWrapper = ({ value, dateTimeFormat }) => {
	const locale = useDateFNSLocale();
	return timeToString(value, dateTimeFormat, locale)?.date;
};

export default TimeToStringWrapper;
