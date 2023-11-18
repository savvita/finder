import { View, StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';
import RadioGroupOption from './RadioGroupOption';

const RadioGroup = ({ title, options, checked, containerStyle, onSelectChanged }) => {
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
            <Text style={ styles.title }>{ title }</Text>
            <View style={ [styles.container, containerStyle ?? {}] }>
                { options.map((item, index) => 
                    <RadioGroupOption
                            key={ index }
                            option={ item.name }
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
        paddingLeft: 20,
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
        borderWidth: 1,
        borderColor: '#cccccc'
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