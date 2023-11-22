import { StyleSheet, ActivityIndicator, View, Image } from 'react-native';
import SearchInput from '../components/SearchInput';
import engine from '../data/search_engine';
import { useState, useEffect } from 'react';
import preferences from '../data/preferences';
import useTheme from '../theme/useTheme';
import useThemedStyles from '../theme/useThemedStyles';
import { FlatList } from 'react-native-gesture-handler';
import ShopResultListItem from '../components/ShopResultListItem';



const SearchScreen = ({ route, navigation }) => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const tasks = {
        'radiomag': (str) => findInRadiomag(str),
        'voron': (str) => findInVoron(str),
        'microteh': (str) => findInMicroteh(str)
    };

    const theme = useTheme();
    const style = useThemedStyles(styles);

    const shops = {
        'radiomag': 'Радіомаг',
        'voron': 'Ворон',
        'microteh': 'Мікротех'
    };

    const [valid, setValid] = useState(true);

    useEffect(() => {
        if(route.params && route.params.text) {
            setSearchText(route.params.text);
            search(route.params.text);
        }
    }, [route, route.params]);

    const search = async (text) => {
        //await loadFavourites();
        const _shops = await preferences.getShops();
  
        setIsLoading(true);
        Promise.allSettled(_shops.map(shop => tasks[shop](text)))
            .then(results => {
                const values = [];
                results.forEach((result, num) => {
                    if (result.status === 'fulfilled') {
                        values.push(result.value);
                    } else {
                        console.log('rejected ' + JSON.stringify(result))
                    }
                });

                setData(values);
                setTimeout(() => {
                    setIsLoading(false);
                  }, 100);
            });
    }

    const findInVoron = async (text) => {
        try {
            const voron = await engine.Voron.searchAsync(text);

            return {
                title: shops.voron,
                data: voron.filter(item => item.available > 0)
            };
        } catch(e) {
            return {
                title: shops.voron,
                data: []
            };
        }
    }

    const findInRadiomag = async (text) => {
        try {
            const city = await preferences.getCity();
            const page = await preferences.getRadiomagPage();
            const radiomag = await engine.Radiomag.searchAsync(text, city ?? 'РАДІОМАГ-Дніпро', parseInt(page ?? '1'));

            return {
                title: shops.radiomag,
                data: radiomag.filter(item => item.available > 0)
            };
        } catch (e) {
            return {
                title: shops.radiomag,
                data: []
            };
        }
    }

    const findInMicroteh = async (text) => {
        try {
            const microteh = await engine.Microteh.searchAsync(text);

            return {
                title: shops.microteh,
                data: microteh.filter(item => item.available > 0),
                comments: 'Мікротех не надає інформацію про доступну кількість товару'
            };
        } catch (e) {
            console.log(e)
            return {
                title: shops.microteh,
                data: []
            };
        }
    }

    const validate = (text) => {
        setValid(text.trim().length > 0);
        return text.trim().length > 0;
    }
    
    const findInGoogle = () => {
        if(validate(searchText)) {
            openUrl('https://google.com.ua/search?q=' + encodeURI(searchText,trim()));
        }
    }

    const findInAliExpress = () => {
        if(validate(searchText)) {
            openUrl('https://www.aliexpress.com/w/wholesale-' + searchText.replace(' ', '-') + '.html');
        }
    }

    return (
        <View style={ style.container }>
            <SearchInput 
                    containerStyle={ style.inputContainer }
                    inputStyle={ style.input }
                    errorStyle={ style.error }
                    onPress={ search } 
                    value={ searchText } 
                    onChange={ (text) => setSearchText(text) }
                    valid={ valid }
                    onValidChange={ (value) => setValid(value) }
                    validation={ true }
                />
                { isLoading ? 
                        <View style={ style.contentContainer }>
                            <ActivityIndicator 
                                    size='large'
                                />
                        </View>
                    :
                    <FlatList
                            data={ data }
                            keyExtractor={ item => item.title }
                            renderItem={ ({ item }) => 
                                <ShopResultListItem
                                        title={ `${ item.title } (${ item.data.length })` }
                                        onPress={() => navigation.navigate('shop', {
                                            value: item 
                                        })}
                                        containerStyle={ style.shopContainer }
                                        textStyle={ style.shopText }
                                    />
                         }
                        />
                }
            <View style={ style.buttonContainer }>
                <CustomizedButton
                        buttonStyle={ style.button }
                        title='Шукати у Google'
                        onPress={ findInGoogle }
                    >
                        <Image 
                                source={ require('../assets/images/google_icon.png') } 
                                style={ style.buttonIcon }
                            />
                </CustomizedButton>
                <CustomizedButton
                        buttonStyle={ style.button }
                        textStyle={ style.buttonText }
                        title='Шукати на AliExpress'
                        onPress={ findInAliExpress }
                    >
                    <Image 
                            source={ require('../assets/images/ali_icon.png') } 
                            style={ style.buttonIcon }
                        />
                </CustomizedButton>
            </View>
        </View>
    );
}

const styles = theme => StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: theme.colors.BACKGROUND
    },
    inputContainer: {
        marginHorizontal: 10,
        marginBottom: 10
    },
    input: {
        backgroundColor: theme.colors.LIGHT
    },
    error: {
        color: theme.colors.ERROR,
        marginStart: 10
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    shopContainer: {
        backgroundColor: theme.colors.SECONDARY,
        borderTopWidth: 0,
        borderBottomColor: theme.colors.BORDER,
        paddingHorizontal: 30,
    },
    shopText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.TEXT
    },
    buttonContainer: { 
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 12
    },
    buttonIcon: {
        width: 20,
        height: 20,
        alignSelf: 'center'
    }
});

export default SearchScreen;