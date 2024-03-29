import { View, StyleSheet, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

const SearchInput = ({ containerStyle, inputStyle, iconStyle, onPress, value, onChange, valid, onValidChange, errorStyle, validation }) => {
    const [text, setText] = useState('');
    const [validationError, setValidationError] = useState(false);

    useEffect(() => {
        if(value) {
            setText(value);
        }
    }, [value]);

    useEffect(() => {
        if(validation === true)
            setValidationError(!valid);
    }, [valid]);

    useEffect(() => {
        onValidChange && onValidChange(!validationError);
    }, [validationError]);

    const handleInput = (txt) => {
        setText(txt);
        validate(txt);
        onChange && onChange(txt);
    }

    const validate = (txt) => {
        if(validation !== true) return true;
        if(txt.trim().length > 0) {
            setValidationError(false);
            return true;
        }

        return false;
    }

    const press = () => {
        if(validate(text)) {
            onPress && onPress(text.trim());
        } else {
            setValidationError(true);
        }
    }


    return (
        <View style={ containerStyle ?? {} }>
            <View style={ [styles.container, inputStyle ?? {}] }>
                <TextInput 
                        value={ text }
                        onChangeText={ handleInput }
                        placeholder='Пошук...' 
                        style={ [styles.input, validationError ? styles.inputError : {}] }
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
            { validationError && <Text style={ [styles.errorText, errorStyle ?? {}] }>Обов'язкове поле</Text> }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    imageContainer: {
        alignSelf: 'center'
    },
    image: {
        width: 30,
        height: 30
    },
    input: {
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