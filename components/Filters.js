import { FlatList } from 'react-native';
import FilterItem from './FilterItem';

const Filters = ({ items, refreshControl, onChange, textStyle, tintColors }) => {
    if(!items) return null;
    
    return (
        <FlatList
                keyExtractor={ item => item.id }
                data={ items }
                refreshControl={ refreshControl }
                renderItem={ ({ item }) => 
                    <FilterItem 
                            item={ item } 
                            onChange={ onChange } 
                            textStyle={ textStyle }
                            tintColors={ tintColors }
                        />
                    }   
            />
    );
}

export default Filters;