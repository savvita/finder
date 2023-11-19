import { View, StyleSheet, Switch, Text } from 'react-native';
import { useState, useEffect } from 'react';

import RadioGroup from '../components/RadioGroup';
import CheckGroup from '../components/CheckGroup';
import preferences from '../data/preferences';
import useTheme from '../theme/useTheme';
import useThemedStyles from '../theme/useThemedStyles';

const SettingsScreen = () => {
    const [city, setCity] = useState(null);
    const [shops, setShops] = useState([]);

    const theme = useTheme();
    const style = useThemedStyles(styles);

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

    const themeChanged = async () => {
        await preferences.setTheme(theme.isLightTheme ? 'dark' : 'light');
        theme.toggleTheme();
    }

    return (
        <View style={ style.container }>
            <View style={ style.switchContainer }>
                <Text style={ [style.text, { fontSize: 16 }] }>Увімкнути темну тему</Text>
                <Switch 
                        onValueChange={ themeChanged } 
                        value={ !theme.isLightTheme } 
                        trackColor={ { true: theme.colors.TRACK, false: theme.colors.TRACK } }
                        thumbColor={ theme.colors.THUMB }
                    />
            </View>
            <View
                    style={{
                        borderBottomColor: theme.colors.BORDER,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        marginVertical: 10
                    }}
                />
            <CheckGroup 
                    title='Магазини'
                    titleStyle={ style.title }
                    containerStyle={ style.groupContainer }
                    optionTextStyle={ style.text }
                    options={ shopsOptions }
                    onSelectChanged={ shopsChanged }
                    checked={ shops }
                    checkMarkColor={ theme.colors.CHECK_MARK }
                />
            {
                shops.find(shop => shop === 'radiomag') && 
                <RadioGroup 
                    title='Місто (Радіомаг)'
                    titleStyle={ style.title }
                    containerStyle={ style.groupContainer }
                    optionTextStyle={ style.text }
                    options={ cityOptions }
                    onSelectChanged={ cityChanged }
                    checked={ city }
                    checkMarkColor={ theme.colors.CHECK_MARK }
                />
            }
        </View>
    );
}

const styles = theme => StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme.colors.BACKGROUND
    },
    switchContainer: {
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    groupContainer: {
        backgroundColor: theme.colors.BACKGROUND,

        borderTopWidth: 1,
        borderTopColor: theme.colors.BORDER,
    },
    title: {
        fontSize: 18,
        paddingVertical: 10,
        paddingStart: 20,
        fontWeight: 'bold',
        flexGrow:1,
        backgroundColor: theme.colors.SECONDARY,
        color: theme.colors.TEXT
    },
    text: {
        color: theme.colors.TEXT,
        paddingStart: 20
    }
});

export default SettingsScreen;