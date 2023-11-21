import { TouchableOpacity, StyleSheet, Text, Image, View, Linking, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomizedButton from './CustomizedButton';

const SearchResultItem = ({ item, containerStyle, titleStyle, textStyle, buttonStyle, buttonTextStyle, favouriteColor, favouriteSize, isFavourite, onFavouritePress, onSpecPress, onCheckAvailablePress }) => {
    const [imageSource, setImageSource] = useState(null);
    const [available, setAvailable] = useState(null);
    const [availableCheck, setAvailableCheck] = useState(false);
    const [loading, setLoading] = useState(false);

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

        setAvailableCheck(item.url.includes('microteh'));
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

    const checkAvailable = async () => {
        if(!onCheckAvailablePress) return;

        try {
            setLoading(true);
            const res = await onCheckAvailablePress(item);
            if(res === true) {
                setAvailable('Є в наявності');
            } else {
                setAvailable('Немає в наявності');
            }
        } catch (e) {
            console.log(e)
            ToastAndroid.show('Не можу зв’язатися з сайтом', ToastAndroid.LONG);
        } finally {
            setTimeout(() => {
                setLoading(false);
              }, 100);
        }
    }
    

    if(!item) return null;

    return (
        <View style={ [styles.container, containerStyle ?? {}] }>
            <View style={ styles.textContainer }>
                <Text style={ [styles.text, styles.title, titleStyle ?? {}] }>{ item.name }</Text>
                {
                    !availableCheck &&
                    <Text style={ [styles.text, textStyle ?? {}] }>У наявності: { item.available } шт.</Text>
                }
                {
                    available &&
                    <Text style={ [styles.text, textStyle ?? {}] }>{ available }</Text>
                }
                <Text style={ [styles.text, textStyle ?? {}] }>Ціна: { item.price }&nbsp;&#8372;</Text>
                {
                    availableCheck && !available &&
                    <CustomizedButton
                            title='Перевірити наявність'
                            onPress={ checkAvailable }
                            buttonStyle={ [styles.button, { marginBottom: 3, flexDirection: 'row', justifyContent: 'center'}, buttonStyle ?? {}] }
                            textStyle={ [styles.buttonText, buttonTextStyle ?? {}] }
                            disabled={ loading }
                        >
                            { loading === true && <ActivityIndicator color={ buttonTextStyle?.color ?? '#00ff00'} />}
                    </CustomizedButton>
                }
                
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
            { item.datasheet && 
            <TouchableOpacity style={ styles.specIconContainer } onPress={ onSpecPress }>
                <Image
                        source={ require('../assets/images/pdf.png') }
                        style={ styles.specIcon }
                    />
                </TouchableOpacity>
            }
            <Ionicons 
                    style={ styles.icon }
                    name={ isFavourite === true ? 'star' : 'star-outline' }
                    size={ favouriteSize ?? 24 } 
                    color={ favouriteColor ?? '#007AFF' } 
                    onPress={ onFavouritePress }
                /> 
        </View>
    );
};

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
    },
    icon: {
        position: 'absolute',
        top: 5,
        right: 10
    },
    specIcon: {
        width: 40, 
        height: 40
    },
    specIconContainer: {
        position: 'absolute',
        right: 0,
        bottom: 5
    }
});

export default SearchResultItem;