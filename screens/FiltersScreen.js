import { View, StyleSheet, Text, ToastAndroid, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import engine from '../data/search_engine';
import Filters from '../components/Filters';
import CustomizedButton from '../components/CustomizedButton';
import useTheme from '../theme/useTheme';
import useThemedStyles from '../theme/useThemedStyles';

const FiltersScreen = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState(null);

    const theme = useTheme();
    const style = useThemedStyles(styles);

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

            console.log(_filters)
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
    
    return (
        <View style={ style.container }>
            {
                filters && filters.filters.length > 0 ?
                    <View style={{ height: '100%', justifyContent: 'space-between'}}>
                        <View style={{ maxHeight: '80%', flexGrow: 1}}>
                            <Filters 
                                    items={ filters.filters } 
                                    refreshControl={ <RefreshControl refreshing={ isLoading } 
                                    onRefresh={ refresh } /> } 
                                    onChange={ onChange }
                                    textStyle={ style.text }
                                    tintColors={{ true: theme.colors.CHECKBOX_CHECKED, false: theme.colors.CHECKBOX_UNCHECKED }}
                                />
                        </View>
                        <CustomizedButton
                                title="Шукати"
                                buttonStyle={ style.button }
                                textStyle={ style.buttonText }
                                onPress={ find }
                            />
                    </View>
                :
                    <Text style={ style.noFiltersText }>Фільтрів не знайдено</Text>
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
    noFiltersText: {
        marginTop: 20,
        color: theme.colors.TEXT
    },
    text: {
        color: theme.colors.TEXT
    },
    button: {
        marginTop: 20,
        backgroundColor: theme.colors.BUTTON
    },
    buttonText: {
        color: theme.colors.BUTTON_TEXT
    }
});

export default FiltersScreen;