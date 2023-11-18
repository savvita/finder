import { View, StyleSheet, TextInput, Image, Text, TouchableOpacity, Linking } from 'react-native';
import { useState, useEffect } from 'react';

const SearchInput = ({ containerStyle, inputStyle, iconStyle, onPress, value }) => {
    const [text, setText] = useState('');
    const [validationError, setValidationError] = useState(false);

    useEffect(() => {
        if(value) {
            setText(value);
        }
    }, [value]);

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

    const findInGoogle = () => {
        if(validate(text)) {
            openUrl('https://google.com.ua/search?q=' + encodeURI(text));
        } else {
            setValidationError(true);
        }
    }

    const findInAliExpress = () => {
        if(validate(text)) {
            openUrl('https://www.aliexpress.com/w/wholesale-' + text.replace(' ', '-') + '.html');
        } else {
            setValidationError(true);
        }
    }

    const openUrl = (url) => {
        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log("Don't know how to open URI: " + url);
                }
            });
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
            <View style={ styles.buttonContainer }>
                <CustomizedButton
                        buttonStyle={ styles.button }
                        title='Шукати у Google'
                        onPress={ findInGoogle }
                    />
                <CustomizedButton
                        buttonStyle={ styles.button }
                        title='Шукати на AliExpress'
                        onPress={ findInAliExpress }
                    />
            </View>
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
    },
    buttonContainer: { 
        flexDirection: 'row',
        marginVertical: 10,
    },
    button: {
        width: '50%'
    }
});

export default SearchInput;