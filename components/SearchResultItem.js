import { TouchableOpacity, StyleSheet, Text, Image, View, Linking } from 'react-native';
import { useEffect, useState } from 'react';
import CustomizedButton from './CustomizedButton';

const SearchResultItem = ({ item, containerStyle, titleStyle, textStyle, buttonStyle, buttonTextStyle }) => {
    const [imageSource, setImageSource] = useState(null);

    useEffect(() => {
        if(!item) return;
        if(item.image && item.image.length > 0) {
            Image.getSize(item.image, (w, h) => {
                setImageSource({ uri: item.image });
            }, (err) => {
                setImageSource(require('../assets/images/no_image.png'));
            });
        } else {
            setImageSource(require('../assets/images/no_image.png'));
        }
    }, []);

    const openUrl = () => {
        Linking.canOpenURL(item.url)
            .then(supported => {
                if (supported) {
                    Linking.openURL(item.url);
                } else {
                    console.log("Don't know how to open URI: " + item.url);
                }
            });
    }

    if(!item) return null;

    return (
        <TouchableOpacity style={ [styles.container, containerStyle ?? {}] }>
            <View style={ styles.textContainer }>
                <Text style={ [styles.text, styles.title, titleStyle ?? {}] }>{ item.name }</Text>
                <Text style={ [styles.text, textStyle ?? {}] }>У наявності: { item.available } шт.</Text>
                <Text style={ [styles.text, textStyle ?? {}] }>Ціна: { item.price }&nbsp;&#8372;</Text>
                <CustomizedButton
                        title='У магазин'
                        onPress={ openUrl }
                        buttonStyle={ [styles.button, buttonStyle ?? {}] }
                        textStyle={ [styles.buttonText, buttonTextStyle ?? {}] }
                    />
            </View>
            { imageSource && 
                <Image
                        source={ imageSource }
                        style={ styles.image }
                    /> 
            }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        padding: 5,
        borderColor: '#777',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textContainer: {
        width: '70%'
    },
    text: {
        paddingHorizontal: 10
    },
    title: {
        fontWeight: '900'
    },
    image: {
        width: 80, 
        height: 80,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#333'
    },
    buttonText: {
        color: '#fff'
    }
});

export default SearchResultItem;