import { View, StyleSheet, FlatList, BackHandler, AppState, ToastAndroid, RefreshControl } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import engine from '../data/search_engine';
import CategoryItem from '../components/CategoryItem';
import Breadcrumbs from '../components/Breadcrumbs';

const CategoriesScreen = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(engine.catalogUrl);

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
        <View style={ styles.container }>
            <Breadcrumbs 
                    items={ breadcrumbs } 
                    onPress={ breadcrumbPress }
                />
                <FlatList
                        data={ categories }
                        keyExtractor={ item => item.id }
                        renderItem={ ({ item }) => 
                            <CategoryItem 
                                    item={ item } 
                                    onPress={ () => categoryPress(item) }
                                />
                        }
                        refreshControl={ <RefreshControl refreshing={ isLoading } onRefresh={ refresh } /> }
                    />
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
    noFiltersText: {
        marginTop: 20
    }
});

export default CategoriesScreen;