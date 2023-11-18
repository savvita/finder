import { View, StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';
import RadioGroupOption from './RadioGroupOption';

const CheckGroup = ({ title, options, checked, containerStyle, onSelectChanged }) => {
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
            <Text style={ styles.title }>{ title }</Text>
            <View style={ [styles.container, containerStyle ?? {}] }>
                { options.map((item, index) => 
                    <RadioGroupOption
                            key={ index }
                            option={ item.name }
                            selected={ selected.find(i => i === item.value) }
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

export default CheckGroup;