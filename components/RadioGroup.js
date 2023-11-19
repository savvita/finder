import { View, StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';
import RadioGroupOption from './RadioGroupOption';

const RadioGroup = ({ title, options, checked, containerStyle, onSelectChanged, titleStyle, optionTextStyle, checkMarkColor }) => {
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        setSelected(checked);
    }, [checked]);

    const selectedChanged = (value) => {
        if(selected !== value) {
            onSelectChanged && onSelectChanged(value);
        }
        setSelected(value);
    }

    if(!options) return null;

    return (
        <View>
            <Text style={ [styles.title, titleStyle ?? {} ]}>{ title }</Text>
            <View style={ [styles.container, containerStyle ?? {}] }>
                { options.map((item, index) => 
                    <RadioGroupOption
                            key={ index }
                            option={ item.name }
                            textStyle={ optionTextStyle }
                            checkMarkColor={ checkMarkColor }
                            selected={ item.value === selected }
                            onSelect={ () => selectedChanged(item.value) }
                            index={ index }
                        />
                ) }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'
    }, 
    title: {
        fontSize: 18,
        paddingVertical: 10,
        paddingStart: 20,
        fontWeight: 'bold',
        flexGrow:1,
        backgroundColor: '#eee'
    }
});

export default RadioGroup;