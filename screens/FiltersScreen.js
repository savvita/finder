import { View, StyleSheet, Text, ToastAndroid, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import engine from '../data/search_engine';
import Filters from '../components/Filters';
import CustomizedButton from '../components/CustomizedButton';

const FiltersScreen = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState(null);

    useEffect(() => {
        loadFilters();
        if(route.params) {
            navigation.setOptions({
                ...navigation.options,
                title: route.params.title
            });
        }
    }, []);

    const loadFilters = async () => {
        setIsLoading(true);

        try {
            const _filters = await engine.Voron.loadFiltersAsync();
            if(_filters) {
                for(let filter of _filters.filters) {
                    filter.options = filter.options.map(item => {
                        return {
                            ...item,
                            checked: false
                        }
                    });
                }
                setFilters(_filters);
            }
        } catch(e) {
            console.log(e);
            ToastAndroid.show('Відсутнє інтернет-з’єднання', ToastAndroid.LONG);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 100);
        }
    }

    const refresh = () => {
        loadFilters();
    }

    const onChange = (filter, option, value) => {
        setFilters(prev => {
            const _filters = [...prev.filters];
            const _filter = _filters.find(f => f.id === filter.id);

            if(_filter) {
                _filter.options = _filter.options.map(_option => _option.id === option.id ? { ..._option, checked: value } : _option);
            }

            return { ...prev, filters: _filters};
        });
    }

    const find = () => {
        const checkedFilters = filters.filters.filter(filter => filter.options.some(option => option.checked === true));
        for(let filter of checkedFilters) {
            filter.options = filter.options.filter(option => option.checked === true);
        }

        navigation.navigate('filters_results', { filters: { code: filters.code, filters: checkedFilters } });
    }

    if(!filters) return null;
    
    return (
        <View style={ styles.container }>
            {
                filters.filters.length > 0 ?
                    <View style={{ height: '100%', justifyContent: 'space-between'}}>
                        <Filters 
                                items={ filters.filters } 
                                refreshControl={ <RefreshControl refreshing={ isLoading } 
                                onRefresh={ refresh } /> } 
                                onChange={ onChange }
                            />
                            <CustomizedButton
                                    title="Шукати"
                                    buttonStyle={ styles.button }
                                    textStyle={ styles.buttonText }
                                    onPress={ find }
                                />
                    </View>
                :
                    <Text style={ styles.noFiltersText }>Фільтрів не знайдено</Text>
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
    noFiltersText: {
        marginTop: 20
    },
    button: {
        marginTop: 20,
        backgroundColor: '#333'
    },
    buttonText: {
        color: '#fff'
    }
});

export default FiltersScreen;