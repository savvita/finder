import { View, StyleSheet, FlatList, Text, RefreshControl, ToastAndroid } from 'react-native';
import { useCallback } from 'react';
import FilterResultItem from '../components/FilterResultItem';
import engine from '../data/search_engine';
import useTheme from '../theme/useTheme';
import useThemedStyles from '../theme/useThemedStyles';
import useArticlesLoading from '../hooks/useArticlesLoading';

const FiltersResultsScreen = ({ navigation, route }) => {
    
    const theme = useTheme();
    const style = useThemedStyles(styles);

    const load = async () => {
        if (!route.params || !route.params.filters) {
            return [];
        }

        try {
            const results = await engine.Voron.filterAsync(route.params.filters);
            return results;
        } catch (e) {
            console.log(e);
            ToastAndroid.show('Відсутнє інтернет-з’єднання', ToastAndroid.LONG);
            return [];
        }

    }

    const navigateToSearching = useCallback((item) => {
        navigation.navigate('search_screen', { text: item.name });
    });

    const { isLoading, articles, onEndReached } = useArticlesLoading(null, load);
    const renderItem = useCallback(({ item }) => {
        return (
            <FilterResultItem 
                    item={ item } 
                    onPress={ () => navigateToSearching(item) }
                    textStyle={ style.text }
                    buttonStyle={ style.button }
                    buttonTextStyle={ style.buttonText }
                    containerStyle={ { backgroundColor: theme.colors.BACKGROUND } }
                />
        );
    });

    return (
        <View style={ style.container }>
            {
                articles.length > 0 ?
                    <FlatList
                        data={ articles }
                        keyExtractor={ item => item.id }
                        renderItem={ renderItem }
                        onEndReachedThreshold={ 0.2 }
                        onEndReached={ onEndReached }
                        removeClippedSubviews
                    />
                :
                    <Text style={ style.noFoundText } >Нічого не знайдено</Text>
            }
        </View>
    );
}

const styles = theme => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: theme.colors.BACKGROUND
    },
    contentContainer: {
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