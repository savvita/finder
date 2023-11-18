import { ScrollView, StyleSheet, View, Text } from 'react-native';
import FilterItem from './FilterItem';

const Filters = ({ items, refreshControl, onChange }) => {
    if(!items) return null;
    console.log(items)
    return (
        // <FlatList
        //         data={ items }
        //         keyExtractor={ item => item.id }
        //         renderItem={ ({ item }) =>
        //             <FilterItem item={ item } onChange={ onChange } />
        //         }
        //         refreshControl={ refreshControl }
        //     />
        <ScrollView style={{ maxHeight: '90%' }} refreshControl={ refreshControl }>
            { items.map((item) =>
                <FilterItem key={ item.id } item={ item } onChange={ onChange } />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({

});

export default Filters;