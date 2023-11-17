import { FlatList, StyleSheet } from 'react-native';
import FilterItem from './FilterItem';

const Filters = ({ items, refreshControl, onChange }) => {
    if(!items) return null;
    return (
        <FlatList
                data={ items }
                keyExtractor={ item => item.id }
                renderItem={ ({ item }) =>
                    <FilterItem item={ item } onChange={ onChange } />
                }
                refreshControl={ refreshControl }
            />
    );
}

const styles = StyleSheet.create({

});

export default Filters;