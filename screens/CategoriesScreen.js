import { View, StyleSheet, FlatList, BackHandler, ToastAndroid, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import engine from '../data/search_engine';
import CategoryItem from '../components/CategoryItem';
import Breadcrumbs from '../components/Breadcrumbs';
import useTheme from '../theme/useTheme';
import useThemedStyles from '../theme/useThemedStyles';

const CategoriesScreen = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(engine.catalogUrl);

    const theme = useTheme();
    const style = useThemedStyles(styles);


    const initializeBreadcrumbs = () => {
        const breadcrumb = {
            title: 'Весь каталог',
            url: engine.catalogUrl,
            breadcrumbs: []
        };
        breadcrumb.breadcrumbs.push(breadcrumb);
        setBreadcrumbs([breadcrumb]);
    }

    const backAction = () => {
        if(breadcrumbs.length <= 1) return false;

        const prevBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
        breadcrumbPress(prevBreadcrumb);
        return true;
    }

    useEffect(() => {
        initializeBreadcrumbs();
        loadCategories();
      
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );


        return () => {
            backHandler.remove();
        }
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [breadcrumbs]);

    const loadCategories = async (category) => {
        setIsLoading(true);

        try {
            const _categories = await engine.Voron.getCategoriesAsync(category ? category.url : currentCategory);
            if(_categories) {
                if(_categories.length === 0 && category) {
                    navigation.navigate('filters', { title: category.title });
                    return false;
                } else {
                    setCategories(_categories);
                }
                if(category && category.url) setCurrentCategory(category.url);
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

    const categoryPress = async (category) => {
        const res = await loadCategories(category);
        
        if(res === true) {
            setBreadcrumbs((prev) => {
                const breadcrumb = {
                    title: category.title,
                    url: category.url,
                    breadcrumbs: [...prev]
                };
                breadcrumb.breadcrumbs.push(breadcrumb);
                return [...prev, breadcrumb];
            });
        }
    }

    const breadcrumbPress = async (item) => {
        if (!item) return;
        await loadCategories(item);
        setBreadcrumbs(item.breadcrumbs);
    }

    const refresh = () => {
        loadCategories(currentCategory);
    }
    
    return (
        <View style={ style.container }>

            <Breadcrumbs 
                    items={ breadcrumbs } 
                    onPress={ breadcrumbPress }
                    textStyle={ style.text }
                />
                <FlatList
                        data={ categories }
                        keyExtractor={ item => item.id }
                        renderItem={ ({ item }) => 
                            <CategoryItem 
                                    item={ item } 
                                    onPress={ () => categoryPress(item) }
                                    textStyle={ style.text }
                                    containerStyle={{ borderBottomColor: theme.colors.BORDER }}
                                />
                        }
                        refreshControl={ <RefreshControl refreshing={ isLoading } onRefresh={ refresh } /> }
                    />
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
    text: {
        color: theme.colors.TEXT
    },
    title: {
        fontSize: 18,
        fontWeight: '400'
    },
    noFiltersText: {
        marginTop: 20
    }
});

export default CategoriesScreen;