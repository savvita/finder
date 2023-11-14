import { ScrollView, StyleSheet, Text } from 'react-native';
import SearchInput from '../components/SearchInput';
import engine from '../data/search_engine';
import { useState } from 'react';
import SearchResultItem from '../components/SearchResultItem';
import Accordion from '../components/Accordion';
import AccordionItem from '../components/AccordionItem';


const SearchScreen = () => {
    const [data, setData] = useState([]);

    const search = async (text) => {
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
            });
    }

    const findInVoron = async (text) => {
        const voron = await engine.Voron.searchAsync(text);

        return {
            title: 'Ворон',
            data: voron
        };
    }

    const findInRadiomag = async (text) => {
        const radiomag = await engine.Radiomag.searchAsync(text);

        return {
            title: 'Радіомаг',
            data: radiomag
        };
    }

    const findInMicroteh = async (text) => {
        const microteh = await engine.Microteh.searchAsync(text);

        return {
            title: 'Мікротех',
            data: microteh,
            comments: 'Мікротех не надає інформацію про доступну кількість товару'
        };
    }

    return (
        <ScrollView>
            <SearchInput onPress={ search } />
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
    );
}

const styles = StyleSheet.create({
    accordionHeader: {
        paddingStart: 10
    },
    comments: {
        paddingStart: 15,
        color: '#f54'
    }
});

export default SearchScreen;