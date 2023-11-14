import { View, StyleSheet, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const SearchInput = ({ containerStyle, inputStyle, iconStyle, onPress }) => {
    const [text, setText] = useState('');
    const [validationError, setValidationError] = useState(false);

    const handleInput = (txt) => {
        setText(txt);
        validate(txt);
    }

    const validate = (txt) => {
        if(txt.length > 0) {
            setValidationError(false);
            return true;
        }

        return false;
    }

    const press = () => {
        if(validate(text)) {
            onPress && onPress(text);
        } else {
            setValidationError(true);
        }
    }

    return (
        <View style={ containerStyle ?? {} }>
        <View style={ [styles.container] }>
            <TextInput 
                    value={ text }
                    onChangeText={ handleInput }
                    placeholder='Пошук...' 
                    style={ [styles.input, validationError ? styles.inputError : {}, inputStyle ?? {}] }
                />
                <TouchableOpacity
                        style={ styles.imageContainer }
                        onPress={ press }
                    >
                    <Image
                        source={ require('../assets/images/search_icon.png') }
                        style={ [styles.image, iconStyle ?? {}] }
                        />
                </TouchableOpacity>
            </View>
            { validationError && <Text style={ styles.errorText }>Обов'язкове поле</Text> }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    imageContainer: {
        alignSelf: 'center'
    },
    image: {
        width: 30,
        height: 30
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#777',
        flexGrow: 1,
        paddingBottom: 4
    },
    inputError: {
        borderBottomColor: '#f23',
    },
    errorText: {
        color: '#f23'
    }
});

export default SearchInput;