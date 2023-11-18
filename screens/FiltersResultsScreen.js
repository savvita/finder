import { View, StyleSheet, FlatList, Text, RefreshControl, ToastAndroid } from 'react-native';
import { useState, useEffect } from 'react';
import FilterResultItem from '../components/FilterResultItem';
import engine from '../data/search_engine';

const FiltersResultsScreen = ({ navigation, route }) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        if(!route.params || !route.params.filters) {
            return;
        }

        setIsLoading(true);

        try {
            const results = await engine.Voron.filterAsync(route.params.filters);
            if(results) {
                setItems(results);
            }
        } catch(e) {
            console.log(e);
            ToastAndroid.show('Відсутнє інтернет-з’єднання', ToastAndroid.LONG);
            return false;
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 100);
        }

        return true;
    }

    const navigateToSearching = (item) => {
        navigation.navigate('search_screen', { text: item.name });
    }

    return (
        <View style={ styles.container }>
            {
                items.length > 0 ?
                    <FlatList
                        data={ items }
                        keyExtractor={ item => item.id }
                        renderItem={ ({ item }) => 
                            <FilterResultItem 
                                    item={ item } 
                                    onPress={ () => navigateToSearching(item) }
                                />
                        }
                        refreshControl={ <RefreshControl refreshing={ isLoading } onRefresh={ load } /> }
                    />
                :
                    <Text style={ styles.noFoundText } refreshControl={ <RefreshControl refreshing={ isLoading } onRefresh={ load } /> } >Нічого не знайдено</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#fff'
    },
    contentContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {

    },
    title: {
        fontSize: 18,
        fontWeight: '400'
    },
    noFoundText: {
        marginTop: 20
    }
});

export default FiltersResultsScreen;