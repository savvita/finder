import { View, StyleSheet, Linking, Text, FlatList, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import FavouriteItem from './FavouriteItem';
import preferences from '../data/preferences';
import useTheme from '../theme/useTheme';
import useThemedStyles from '../theme/useThemedStyles';
import SearchInput from '../components/SearchInput';

const FavouritesScreen = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchText, setSearchText] = useState('');

    const theme = useTheme();
    const style = useThemedStyles(styles);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    useEffect(() => {
        filter(searchText);
    }, [items]);

    const loadPreferences = async () => {
        const _values = await preferences.getFavourites();
        setItems(_values);
        return _values;
    }

    const filter = (text) => {
        setSearchText(text);
        text = text.toLowerCase();
        if(text.length > 0) {
            setFilteredItems(items.filter(item => item.title.toLowerCase().includes(text)));
        } else {
            setFilteredItems([...items]);
        }
    }

    const openUrl = (url) => {
        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log("Don't know how to open URI: " + url);
                }
            });
    }

    const removeItem = async (item) => {
        const _items = await preferences.getFavourites();
        await preferences.setFavourites(_items.filter(i => i.url !== item.url));
        await loadPreferences();
    }

    return (
        <View style={ style.container }>
            <SearchInput
                    containerStyle={ style.inputContainer }
                    inputStyle={ style.input }
                    onPress={ filter } 
                    value={ searchText } 
                    onChange={ (text) => filter(text) }
                />
            {
                filteredItems.length > 0 ?
                    <FlatList
                        data={ filteredItems }
                        keyExtractor={ item => item.url }
                        renderItem={ ({ item }) => 
                            <FavouriteItem item={ item } 
                                    containerStyle={ style.itemContainer }
                                    textStyle={ style.text }
                                    onPress={ () => openUrl(item.url) }
                                    deleteStyle={ { color: theme.colors.ERROR } }
                                    onDeletePress={ () => removeItem(item) }
                                />
                        }
                        refreshControl={ <RefreshControl refreshing={ isLoading } 
                        onRefresh={ loadPreferences } /> }
                    />
                :
                    <View style={ style.center }>
                        <Text style={ style.text }>Улюбленці не знайдені</Text>
                    </View>
            }
        </View>
    );
}

const styles = theme => StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: theme.colors.BACKGROUND, 
        paddingTop: 20
    },
    inputContainer: {
        marginHorizontal: 10,
        marginBottom: 10
    },
    input: {
        backgroundColor: theme.colors.LIGHT
    },
    itemContainer: {
        paddingHorizontal: 20,
        borderBottomColor: theme.colors.BORDER
    },
    text: {
        color: theme.colors.TEXT
    },
    center: {
        marginTop: 30,
        alignItems: 'center'
    }
});

export default FavouritesScreen;