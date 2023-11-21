import { Text, ActivityIndicator, FlatList } from 'react-native';
import { useCallback } from 'react';
import AccordionItem from "./AccordionItem";
import SearchResultItem from '../components/SearchResultItem';
import engine from '../data/search_engine';
import useArticlesLoading from '../hooks/useArticlesLoading';

const ShopResults = ({ shop, favourites, navigation, onToggleFavourite, favouriteColor, buttonStyle, buttonTextStyle, textStyle, titleStyle, containerStyle, accordionHeaderStyle, headerContainerStyle, commentsStyle }) => {
    const { isLoading, articles, onEndReached } = useArticlesLoading(shop.data);

    const isFavourite = useCallback((item) => {
        return favourites.find(f => f.url === item.url) !== undefined;
    })

    const openPdf = useCallback((url) => {
        navigation.navigate('pdf', { url: url});
    })

    const checkAvailable = useCallback(async (item) => {
        return await engine.Microteh.checkAvailableAsync(item);
    })

    const toggleFavourite = useCallback((dataItem, title) => {
        onToggleFavourite && onToggleFavourite(dataItem, title);
    })

    const renderItem = useCallback(({ item }) => {
        return (
            <SearchResultItem 
                    key={ item.id } 
                    item={ item } 
                    containerStyle={ containerStyle }
                    titleStyle={ titleStyle }
                    textStyle={ textStyle }
                    buttonStyle={ buttonStyle }
                    buttonTextStyle={ buttonTextStyle }
                    favouriteColor={ favouriteColor }
                    isFavourite = { isFavourite(item) }
                    onFavouritePress={ () => toggleFavourite(item, shop.title) }
                    onSpecPress={ () => openPdf(item.datasheet) }
                    onCheckAvailablePress={ () => checkAvailable(item) }
                />
        );
    });

    return (
        <AccordionItem
                title={ `${ shop.title } (${ shop.data.length })`}
                headerContainerStyle={ headerContainerStyle }
                headerTitleStyle={ accordionHeaderStyle }
            >
                { shop.comments && <Text style={ commentsStyle }>* {  shop.comments }</Text> }
                {
                    isLoading ?
                        <ActivityIndicator />
                    :
                    <FlatList
                            data={ articles }
                            keyExtractor={ item => item.url }
                            renderItem={ renderItem }
                            onEndReachedThreshold={ 0.2 }
                            onEndReached={ onEndReached }
                        />
                }
                
            </AccordionItem>
    );
}

export default ShopResults;