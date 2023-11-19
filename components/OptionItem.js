import { View, StyleSheet, Text } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useState, useEffect } from 'react';

const OptionItem = ({ item, onChange, textStyle, tintColors }) => {
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        if(item) {
            setIsSelected(item.checked);
        }
    }, [item]);

    const valueChanged = (newValue) => {
        onChange && onChange(newValue);
    }

    if(!item || item.amount == 0) return null;
    return (
        <View style={ styles.container }>
            <CheckBox
                    value={ isSelected }
                    onValueChange={ valueChanged }
                    tintColors={ tintColors ?? { true: '#F15927', false: 'black' }}
                />
            <Text 
                    style={ [styles.text, textStyle ?? {}] }
                    onPress={ () => valueChanged(!isSelected) }
                >
                    { item.title } ({ item.amount })
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    text: {
        fontSize: 16,
        alignSelf: 'center'
    }
});

export default OptionItem;