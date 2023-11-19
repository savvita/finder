import { View, StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';
import RadioGroupOption from './RadioGroupOption';

const CheckGroup = ({ title, options, checked, containerStyle, onSelectChanged,titleStyle, optionTextStyle, checkMarkColor }) => {
    const [selected, setSelected] = useState(checked);

    useEffect(() => {
        setSelected(checked);
    }, [checked]);


    const selectedChanged = (value) => {
        setSelected(prev => {
            const val = selected.find(item => item === value);
            let _values;

            if(val) {
                _values = prev.filter(item => item !== value);
            } else {
                _values = [...prev, value];
            }

            onSelectChanged && onSelectChanged(_values);
            return _values;
        });

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
                            selected={ selected.find(i => i === item.value) }
                            checkMarkColor={ checkMarkColor }
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

export default CheckGroup;