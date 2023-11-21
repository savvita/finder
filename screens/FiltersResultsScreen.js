import { View, StyleSheet, FlatList, Text, RefreshControl, ToastAndroid } from 'react-native';
import { useState, useEffect } from 'react';
import FilterResultItem from '../components/FilterResultItem';
import engine from '../data/search_engine';
import useTheme from '../theme/useTheme';
import useThemedStyles from '../theme/useThemedStyles';

const FiltersResultsScreen = ({ navigation, route }) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();
    const style = useThemedStyles(styles);

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
        <View style={ style.container }>
            {
                items.length > 0 ?
                    <FlatList
                        data={ items }
                        keyExtractor={ item => item.id }
                        renderItem={ ({ item }) => 
                            <FilterResultItem 
                                    item={ item } 
                                    onPress={ () => navigateToSearching(item) }
                                    textStyle={ style.text }
                                    buttonStyle={ style.button }
                                    buttonTextStyle={ style.buttonText }
                                    containerStyle={ { backgroundColor: theme.colors.BACKGROUND } }
                                />
                        }
                        refreshControl={ <RefreshControl refreshing={ isLoading } onRefresh={ load } /> }
                    />
                :
                    <Text style={ style.noFoundText } refreshControl={ <RefreshControl refreshing={ isLoading } onRefresh={ load } /> } >Нічого не знайдено</Text>
            }
        </View>
    );
}

const styles = theme => StyleSheet.create({
    container: {
        // height: '100%',
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: theme.colors.BACKGROUND
    },
    contentContainer: {
        // height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: theme.colors.TEXT
    },
    button: {
        backgroundColor: theme.colors.BUTTON
    },
    buttonText: {
        color: theme.colors.BUTTON_TEXT
    },
    title: {
        fontSize: 18,
        fontWeight: '400'
    },
    noFoundText: {
        marginTop: 20,
        color: theme.colors.TEXT
    }
});

export default FiltersResultsScreen;