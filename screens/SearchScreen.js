import { ScrollView, StyleSheet, Text, ActivityIndicator, View, Linking, Image } from 'react-native';
import SearchInput from '../components/SearchInput';
import engine from '../data/search_engine';
import { useState, useEffect } from 'react';
import SearchResultItem from '../components/SearchResultItem';
import Accordion from '../components/Accordion';
import AccordionItem from '../components/AccordionItem';
import preferences from '../data/preferences';


const SearchScreen = ({ navigation, route }) => {
    // navigation.setOptions({ ...navigation.options, title: 'ssd' });
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const tasks = {
        'radiomag': (str) => findInRadiomag(str),
        'voron': (str) => findInVoron(str),
        'microteh': (str) => findInMicroteh(str)
    };

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
                title: 'Ворон',
                data: voron.filter(item => item.available > 0)
            };
        } catch(e) {
            return {
                title: 'Ворон',
                data: []
            };
        }
    }

    const findInRadiomag = async (text) => {
        try {
            const city = await preferences.getCity();
            const radiomag = await engine.Radiomag.searchAsync(text, city ?? 'РАДІОМАГ-Дніпро');

            return {
                title: 'Радіомаг',
                data: radiomag.filter(item => item.available > 0)
            };
        } catch (e) {
            return {
                title: 'Радіомаг',
                data: []
            };
        }
    }

    const findInMicroteh = async (text) => {
        try {
            const microteh = await engine.Microteh.searchAsync(text);

            return {
                title: 'Мікротех',
                data: microteh.filter(item => item.available > 0),
                comments: 'Мікротех не надає інформацію про доступну кількість товару'
            };
        } catch (e) {
            return {
                title: 'Мікротех',
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


    return (
        <View style={ styles.container }>
            <SearchInput 
                    containerStyle={{ marginHorizontal: 10, marginBottom: 10 }}
                    onPress={ search } 
                    value={ searchText } 
                    onChange={ (text) => setSearchText(text) }
                    valid={ valid }
                    onValidChange={ (value) => setValid(value) }
                />
            { isLoading ? 
                    <View style={ styles.contentContainer }>
                        <ActivityIndicator 
                                size='large'
                            />
                    </View>
                :
                <ScrollView>
                    <Accordion>
                        { data.map((item, index) => 
                            <AccordionItem
                                    key={ index }
                                    title={ `${ item.title } (${ item.data.length })`}
                                    headerContainerStyle={ styles.accordionHeaderContainer }
                                    iconStyle={ styles.accordionIcon }
                                    headerTitleStyle={ styles.accordionHeader }
                                >
                                    { item.comments && <Text style={ styles.comments }>* {  item.comments }</Text> }
                                    { item.data.map((dataItem) => <SearchResultItem key={ dataItem.id } item={ dataItem } />) }
                            </AccordionItem>
                            
                        ) }
                    </Accordion>
                </ScrollView>
            }
            <View style={ styles.buttonContainer }>
                <CustomizedButton
                        buttonStyle={ styles.button }
                        title='Шукати у Google'
                        onPress={ findInGoogle }
                    >
                        <Image 
                                source={ require('../assets/images/google_icon.png') } 
                                style={ styles.buttonIcon }
                            />
                </CustomizedButton>
                <CustomizedButton
                        buttonStyle={ styles.button }
                        textStyle={ styles.buttonText }
                        title='Шукати на AliExpress'
                        onPress={ findInAliExpress }
                    >
                    <Image 
                            source={ require('../assets/images/ali_icon.png') } 
                            style={ styles.buttonIcon }
                        />
                </CustomizedButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingVertical: 10,
        backgroundColor: '#fff'
    },
    contentContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    accordionHeaderContainer: {
        backgroundColor: '#eeeeee44',
        // backgroundColor: '#efffefaa',
        borderTopWidth: 0
    },
    accordionHeader: {
        paddingStart: 30,
        fontSize: 18,
        fontWeight: 'bold'
    },
    accordionIcon: {
        marginEnd: 10
    },
    comments: {
        paddingStart: 15,
        color: '#f54'
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