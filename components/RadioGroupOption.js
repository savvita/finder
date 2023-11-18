import { TouchableWithoutFeedback, StyleSheet, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RadioGroupOption = ({ option, selected, onSelect, index, containerStyle, textStyle, checkMarkSize, checkMarkColor }) => {
    let _containerStyle = styles.container;

    if(index > 0) {
        _containerStyle = [_containerStyle, {
            borderTopColor: '#eeeeee',
            borderTopWidth: 1,
        }];
    }

    return (
        <TouchableWithoutFeedback
                onPress={ onSelect }
            >
            <View style={ [_containerStyle, containerStyle ?? {}] }>
                <Text style={ [styles.text, textStyle ?? {}] }>{ option }</Text>
                { selected && 
                    <View style={{ alignSelf: 'center' }}>
                        <Ionicons 
                                name='checkmark' 
                                size={ checkMarkSize ?? 24 } 
                                color={ checkMarkColor ?? '#007AFF' } 
                            /> 
                    </View>
                }
            </View>

        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingEnd: 10
    },
    text: {
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1,
        fontSize: 14,
    }
});

export default RadioGroupOption;