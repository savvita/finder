import { StyleSheet, ActivityIndicator, View, Linking, Image } from 'react-native';
import SearchInput from '../components/SearchInput';
import engine from '../data/search_engine';
import { useState, useEffect } from 'react';
import ShopResults from '../components/ShopResults';
import preferences from '../data/preferences';
import useTheme from '../theme/useTheme';
import useThemedStyles from '../theme/useThemedStyles';
import { FlatList } from 'react-native-gesture-handler';



const SearchScreen = ({ route, navigation }) => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [favourites, setFavourites] = useState([]);
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

    const loadFavourites = async () => {
        const _values = await preferences.getFavourites();
        setFavourites(_values);
        return _values;
    }
    const search = async (text) => {
        await loadFavourites();
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
            const page = await preferences.getMicrotehPage();
            const microteh = await engine.Microteh.searchAsync(text, parseInt(page ?? '1'));

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
        setValid(text.length > 0);
        return text.length > 0;
    }
    
    const findInGoogle = () => {
        if(validate(searchText)) {
            openUrl('https://google.com.ua/search?q=' + encodeURI(searchText));
        }
    }

    const findInAliExpress = () => {
        if(validate(searchText)) {
            openUrl('https://www.aliexpress.com/w/wholesale-' + searchText.replace(' ', '-') + '.html');
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
                                <ShopResults 
                                        shop={ item } 
                                        favourites={ favourites } 
                                        navigation={ navigation } 
                                        onToggleFavourite={ toggleFavourite } 
                                        favouriteColor={ theme.colors.FAVOURITE } 
                                        buttonStyle={ { backgroundColor: theme.colors.BUTTON } } 
                                        buttonTextStyle={ { color: theme.colors.BUTTON_TEXT } } 
                                        textStyle={ { color: theme.colors.TEXT } } 
                                        titleStyle={ { color: theme.colors.TEXT } } 
                                        containerStyle={ { borderColor: theme.colors.BORDER } } 
                                        accordionHeaderStyle={ style.accordionHeader } 
                                        headerContainerStyle={ style.accordionHeaderContainer }
                                        commentsStyle={ style.comments }
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
    accordionHeaderContainer: {
        backgroundColor: theme.colors.SECONDARY,
        borderTopWidth: 0,
        borderBottomColor: theme.colors.BORDER,
        paddingHorizontal: 30,
    },
    accordionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.TEXT
    },
    comments: {
        paddingStart: 15,
        color: theme.colors.ERROR
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