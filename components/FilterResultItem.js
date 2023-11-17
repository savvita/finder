import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { useState, useEffect } from 'react';
import CustomizedButton from './CustomizedButton';

const FilterResultItem = ({ item, containerStyle, onPress }) => {
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

    if(!item) return;

    return (
        <TouchableOpacity style={ [styles.container, containerStyle ?? {}] }>
            <View style={ styles.textContainer }>
                <Text style={ [styles.text, styles.title] }>{ item.name }</Text>
                <CustomizedButton
                        buttonStyle={ styles.button }
                        title='Перейти до пошуку'
                        onPress={ onPress }
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
        resizeMode: 'contain'
    },
    button: {
        marginTop: 20
    }
});

export default FilterResultItem;