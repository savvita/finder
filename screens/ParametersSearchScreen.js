import { View, StyleSheet, FlatList, BackHandler, ActivityIndicator, ToastAndroid, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import engine from '../data/search_engine';
import CategoryItem from '../components/CategoryItem';
import Breadcrumbs from '../components/Breadcrumbs';

const ParametersSearchScreen = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [filters, setFilters] = useState([]);
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

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [breadcrumbs]);

    const loadCategories = async (url) => {
        setIsLoading(true);

        try {
            const _categories = await engine.Voron.getCategoriesAsync(url);
            if(_categories) {
                setCategories(_categories);
                if(url) setCurrentCategory(url);
                if(_categories.length === 0) {
                    setFilters(await engine.Voron.loadFiltersAsync());
                } else {
                    setFilters([]);
                }
            }
        } catch(e) {
            console.log(e);
            ToastAndroid.show('Відсутнє інтернет-з’єднання', ToastAndroid.LONG);
        } finally {
            // if(!url) initializeBreadcrumbs();
            setTimeout(() => {
                setIsLoading(false);
            }, 100);
        }

    }

    const categoryPress = async (category) => {
        await loadCategories(category.url);
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

    const breadcrumbPress = async (item) => {
        if (!item) return;
        await loadCategories(item.url);
        setBreadcrumbs(item.breadcrumbs);
    }

     
    
    return (
        <RefreshControl refreshing={ isLoading } onRefresh={ () => loadCategories(currentCategory) }>
            <View style={ styles.container }>
                <View>
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
                        />
                </View>
            </View>
            
        </RefreshControl>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10
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
    }
});

export default ParametersSearchScreen;