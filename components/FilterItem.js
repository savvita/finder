import { StyleSheet } from 'react-native';
import OptionItem from '../components/OptionItem';
import AccordionItem from '../components/AccordionItem';

const FilterItem = ({ item, onChange }) => {
    const valueChanged = (option, value) => {
        onChange && onChange(item, option, value);
    }

    if(!item || item.options.length === 0) return null;

    return (
        <AccordionItem 
                title={ item.title }
                headerTitleStyle={ styles.accordionHeader }
            >
            { item.options.map((item) => <OptionItem key={ item.id } item={ item } onChange={ (value) => valueChanged(item, value) } />) }
        </AccordionItem>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16
    },
    accordionHeader: {
        paddingStart: 10
    }
});

export default FilterItem;