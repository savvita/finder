import { View, StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { Tooltip } from '@rneui/themed';
import RadioGroupOption from './RadioGroupOption';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RadioGroup = ({ 
    title, 
    options, 
    checked, 
    containerStyle, 
    onSelectChanged, 
    titleStyle, 
    optionTextStyle, 
    checkMarkColor,
    tooltip
}) => {
    const [selected, setSelected] = useState(null);
    const [toolTipVisible, setToolTipVisible] = useState(false);

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
            <View style={ [styles.row, { backgroundColor: titleStyle?.backgroundColor ?? '#eee' }] }>
                <Text style={ [styles.title, titleStyle ?? {} ]}>{ title }</Text>
                {
                    tooltip &&
                    <Tooltip
                            visible={ toolTipVisible }
                            onOpen={() => setToolTipVisible(true) }
                            onClose={() => setToolTipVisible(false) }
                            popover={<Text style={ styles.text }>{ tooltip }</Text>}
                            width={ 260 }
                            height={ 80 }
                        >
                            <Ionicons 
                                    name='information-circle-outline' 
                                    size={ 24 } 
                                    color={ checkMarkColor ?? '#007AFF' } 
                                    style={ styles.info }
                                /> 
                    </Tooltip>
                }
            </View>
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
    },
    text: {
        color: '#fff'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    info: {
        marginRight: 10,
        marginTop: 10
    }
});

export default RadioGroup;