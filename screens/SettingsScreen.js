import { View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

import RadioGroup from '../components/RadioGroup';
import CheckGroup from '../components/CheckGroup';
import preferences from '../data/preferences';

const SettingsScreen = () => {
    const [city, setCity] = useState(null);
    const [shops, setShops] = useState([]);

    useEffect(() => {
        getCity();
        getShops();
    }, []);

    const getCity = async () => {
        setCity(await preferences.getCity());
    }

    const getShops = async () => {
        setShops(await preferences.getShops());
    }

    const cityOptions = [
        {
            name: 'Дніпро',
            value: 'РАДІОМАГ-Дніпро'
        },
        {
            name: 'Київ',
            value: 'РАДІОМАГ-Київ'
        }, 
        {
            name: 'Львів',
            value: 'РАДІОМАГ-Львів'
        },
        {
            name: 'Харків',
            value: 'РАДІОМАГ-Харків'
        }, 
        {
            name: 'Одеса',
            value: 'РАДІОМАГ-Одеса'
        }
    ];

    const shopsOptions = [
        {
            name: 'Радіомаг',
            value: 'radiomag'
        },
        {
            name: 'Ворон',
            value: 'voron'
        }, 
        {
            name: 'Мікротех',
            value: 'microteh'
        }
    ];


    const cityChanged = (value) => {
        preferences.setCity(value);
    }

    const shopsChanged = async (values) => {
        await preferences.setShops(values);
        await getShops();
    }
    return (
        <View style={ styles.container }>
            <CheckGroup 
                    title='Магазини'
                    options={ shopsOptions }
                    onSelectChanged={ shopsChanged }
                    checked={ shops }
                />
            {
                shops.find(shop => shop === 'radiomag') && 
                <RadioGroup 
                    title='Місто (Радіомаг)'
                    options={ cityOptions }
                    onSelectChanged={ cityChanged }
                    checked={ city }
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 18,
        marginVertical: 10,
        paddingStart: 20,
        fontWeight: 'bold'
    }
});

export default SettingsScreen;