import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import useArticlesLoading from '../hooks/useArticlesLoading';
import SearchResultItem from '../components/SearchResultItem';
import useTheme from '../theme/useTheme';
import useThemedStyles from '../theme/useThemedStyles';
import engine from '../data/search_engine';
import preferences from '../data/preferences';

const ShopResultsScreen = ({ navigation, route }) => {
    const [value, setValue] = useState(null);
    const [favourites, setFavourites] = useState([]);
    const { _, articles, onEndReached } = useArticlesLoading(route.params.value.data ?? []);
    const theme = useTheme();
    const style = useThemedStyles(styles);

    useEffect(() => {
        if(!route.params || !route.params.value) return;
        navigation.setOptions({
            ...navigation.options,
            title: `${ route.params.value.title } (${ route.params.value.data.length })`
        });
        setValue(route.params.value);
        loadFavourites();
    }, []);

    const loadFavourites = async () => {
        const _values = await preferences.getFavourites();
        setFavourites(_values);
        return _values;
    }

    const toggleFavourite = async (item, shop) => {
        const _favourites = await loadFavourites();
        const val = _favourites.find(i => i.url === item.url);
        if(val) {
            await preferences.setFavourites(_favourites.filter(i => i.url !== item.url));
        } else {
            await preferences.setFavourites([..._favourites, {
                title: item.name,
                url: item.url,
                shop: shop
            }]);
        }
        
        await loadFavourites();
    }

    const isFavourite = useCallback((item) => {
        return favourites.find(f => f.url === item.url) !== undefined;
    })

    const openPdf = useCallback((url) => {
        navigation.navigate('pdf', { url: url});
    })

    const checkAvailable = useCallback(async (item) => {
        return await engine.Microteh.checkAvailableAsync(item);
    })

    const renderItem = useCallback(({ item }) => {
        return (
            <SearchResultItem 
                    key={ item.id } 
                    item={ item } 
                    containerStyle={ style.container }
                    titleStyle={ style.text }
                    textStyle={ style.text }
                    buttonStyle={ style.button }
                    buttonTextStyle={ style.buttonText }
                    favouriteColor={ theme.colors.FAVOURITE }
                    isFavourite = { isFavourite(item) }
                    onFavouritePress={ () => toggleFavourite(item, value.title) }
                    onSpecPress={ () => openPdf(item.datasheet) }
                    onCheckAvailablePress={ () => checkAvailable(item) }
                />
        );
    });

    if(!value) return null;

    return (
        <View style={ style.wrapper }>
            { value.comments && <Text style={ style.comments }>* {  value.comments }</Text> }
            <FlatList
                    data={ articles }
                    keyExtractor={ item => item.url }
                    renderItem={ renderItem }
                    onEndReachedThreshold={ 0.2 }
                    onEndReached={ onEndReached }
                    removeClippedSubviews
                />
        </View>
    );
}

const styles = theme => StyleSheet.create({
    wrapper: {
        backgroundColor: theme.colors.BACKGROUND,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flex: 1
    },
    container: {
        borderColor: theme.colors.BORDER
    },
    button: {
        backgroundColor: theme.colors.BUTTON
    },
    buttonText: {
        color: theme.colors.BUTTON_TEXT
    },
    text: {
        color: theme.colors.TEXT
    },
    comments: {
        paddingStart: 15,
        paddingBottom: 5,
        color: theme.colors.ERROR,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.BORDER
    }
});

export default ShopResultsScreen;