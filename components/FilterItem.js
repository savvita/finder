import { StyleSheet } from 'react-native';
import OptionItem from '../components/OptionItem';
import AccordionItem from '../components/AccordionItem';
import Accordion from './Accordion';

const FilterItem = ({ item, onChange, textStyle, tintColors }) => {
    const valueChanged = (option, value) => {
        onChange && onChange(item, option, value);
    }

    if(!item || item.options.length === 0) return null;

    return (
        <Accordion>
            <AccordionItem 
                    title={ item.title }
                    headerTitleStyle={ textStyle }
                    headerContainerStyle={ styles.accordionHeader }
                >
                { item.options.map((item) => 
                    <OptionItem 
                            key={ item.id } 
                            item={ item } 
                            onChange={ (value) => valueChanged(item, value) } 
                            textStyle={ textStyle }
                            tintColors={ tintColors }
                        />) 
                }
            </AccordionItem>
        </Accordion>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16
    },
    accordionHeader: {
        paddingHorizontal: 10
    }
});

export default FilterItem;