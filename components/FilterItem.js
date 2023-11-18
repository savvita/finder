import { StyleSheet } from 'react-native';
import OptionItem from '../components/OptionItem';
import AccordionItem from '../components/AccordionItem';
import Accordion from './Accordion';

const FilterItem = ({ item, onChange }) => {
    const valueChanged = (option, value) => {
        onChange && onChange(item, option, value);
    }

    if(!item || item.options.length === 0) return null;

    return (
        <Accordion>
            <AccordionItem 
                    title={ item.title }
                    headerTitleStyle={ styles.accordionHeader }
                    iconStyle={ { marginEnd: 10 }}
                >
                { item.options.map((item) => <OptionItem key={ item.id } item={ item } onChange={ (value) => valueChanged(item, value) } />) }
            </AccordionItem>
        </Accordion>
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