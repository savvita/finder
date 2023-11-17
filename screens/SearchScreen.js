import { ScrollView, StyleSheet, Text, ActivityIndicator, View } from 'react-native';
import SearchInput from '../components/SearchInput';
import engine from '../data/search_engine';
import { useState, useEffect } from 'react';
import SearchResultItem from '../components/SearchResultItem';
import Accordion from '../components/Accordion';
import AccordionItem from '../components/AccordionItem';


const SearchScreen = ({ navigation, route }) => {
    // navigation.setOptions({ ...navigation.options, title: 'ssd' });
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(route.params && route.params.text) {
            setSearchText(route.params.text);
            search(route.params.text);
        }
        
    }, [route]);

    const search = async (text) => {
        setIsLoading(true);
        Promise.allSettled([
            findInRadiomag(text),
            findInVoron(text), 
            findInMicroteh(text)
        ])
            .then(results => {
                const values = [];
                results.forEach((result, num) => {
                    if (result.status === 'fulfilled') {
                        values.push(result.value);
                    }
                });

                setData(values);
                setTimeout(() => {
                    setIsLoading(false);
                  }, 100);
            });
    }

    const findInVoron = async (text) => {
        const voron = await engine.Voron.searchAsync(text);

        return {
            title: 'Ворон',
            data: voron.filter(item => item.available > 0)
        };
    }

    const findInRadiomag = async (text) => {
        const radiomag = await engine.Radiomag.searchAsync(text, 'РАДІОМАГ-Дніпро');

        return {
            title: 'Радіомаг',
            data: radiomag.filter(item => item.available > 0)
        };
    }

    const findInMicroteh = async (text) => {
        const microteh = await engine.Microteh.searchAsync(text);

        return {
            title: 'Мікротех',
            data: microteh.filter(item => item.available > 0),
            comments: 'Мікротех не надає інформацію про доступну кількість товару'
        };
    }

    return (
        <View style={ styles.container }>
            <SearchInput onPress={ search } value={ searchText } />
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
                                    headerTitleStyle={ styles.accordionHeader }
                                >
                                    { item.comments && <Text style={ styles.comments }>* {  item.comments }</Text> }
                                    { item.data.map((dataItem) => <SearchResultItem key={ dataItem.id } item={ dataItem } />) }
                            </AccordionItem>
                            
                        ) }
                    </Accordion>
                </ScrollView>
            }
        </View>
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
    accordionHeader: {
        paddingStart: 10
    },
    comments: {
        paddingStart: 15,
        color: '#f54'
    }
});

export default SearchScreen;