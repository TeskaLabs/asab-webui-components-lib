import { useStore } from 'react-redux';
import { initializeDateFNSLocale, getDateFNSLocale } from './dateFNSLocale';

const useDateFNSLocale = () => {
    const store = useStore();
    initializeDateFNSLocale(store); // Ensures subscription is initialized only once
    return getDateFNSLocale(); // Retrieve the locale dynamically
};

export default useDateFNSLocale;
