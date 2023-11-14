import { ScrollView, StyleSheet } from 'react-native';
import SearchInput from '../components/SearchInput';
import engine from '../data/search_engine';
import { useState } from 'react';
import SearchResultItem from '../components/SearchResultItem';
import Accordion from '../components/Accordion';
import AccordionItem from '../components/AccordionItem';


const SearchScreen = () => {
    const [data, setData] = useState([]);

    const search = async (text) => {
        const results = [...data];
        const radiomag = await engine.Radiomag.searchAsync(text, 'РАДІОМАГ-Дніпро');

        if(radiomag) {
            const findItem = data.find(item => item.title === 'Радіомаг');
            if(!findItem) {
                results.push({
                    title: 'Радіомаг',
                    data: radiomag
                });
            } else {
                findItem.data = radiomag;
            }
        }

        const voron = await engine.Voron.searchAsync(text);
        
        if(voron) {
            const findItem = data.find(item => item.title === 'Ворон');
            if(!findItem) {
                results.push({
                    title: 'Ворон',
                    data: voron
                });
            } else {
                findItem.data = voron;
            }
        }

        setData([...results]);
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
    }
});

export default SearchScreen;