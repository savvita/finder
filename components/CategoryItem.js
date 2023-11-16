import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

const CategoryItem = ({ item, onPress, containerStyle, textStyle, imageStyle }) => {
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

    if(!item) return null;

    return (
        <TouchableOpacity 
                style={ [styles.container, containerStyle ?? {} ] }
                onPress={ onPress }
            >
            <Image
                    source={ imageSource ?? require('../assets/images/no_image.png') }
                    style={ [styles.image, imageStyle ?? {}] } 
                />
            <View style={ styles.textContainer }>
                    <Text style={ [styles.text, textStyle ?? {} ] }>{ item.title }</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#aaa'
    },
    image: {
        width: 50, 
        height: 50,
        resizeMode: 'contain'
    },
    textContainer: {
        flexShrink: 1, 
        flexDirection: 'row',
        paddingStart: 10
    },
    text: {
        fontSize: 20,
        alignSelf: 'center'
    }
});

export default CategoryItem;