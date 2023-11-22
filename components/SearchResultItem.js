import { TouchableOpacity, StyleSheet, Text, Image, View, Linking, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomizedButton from './CustomizedButton';
import DatasheetButton from './DatasheetButton';
import CheckAvailableButton from './CheckAvailableButton';

class SearchResultItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: null,
            available: null,
            availableCheck: false
        }
    }

    componentDidMount = () => {
        if(!this.props.item) return;
        if(this.props.item.image && this.props.item.image.length > 0) {
            Image.getSize(this.props.item.image, (w, h) => {
                this.setState({ 
                    ...this.state, 
                    imageSource: { uri: this.props.item.image }
                });
            }, (err) => {
                this.setState({ 
                    ...this.state, 
                    imageSource: require('../assets/images/no_image.png')
                });
            });
        } else {
            this.setState({ 
                ...this.state, 
                imageSource: require('../assets/images/no_image.png')
            });
        }
        this.setState({
            ...this.state,
            availableCheck: this.props.item.url.includes('microteh')
        });
    }

    openUrl = () => {
        Linking.canOpenURL(this.props.item.url)
            .then(supported => {
                if (supported) {
                    Linking.openURL(this.props.item.url);
                } else {
                    console.log("Don't know how to open URI: " + this.props.item.url);
                }
            });
    }

    checkAvailable = async () => {
        const res = await this.props.onCheckAvailablePress(this.props.item);
        if(res === true) {
            this.setState({
                ...this.state,
                available: 'Є в наявності'
            });
        } else {
            this.setState({
                ...this.state,
                available: 'Немає в наявності'
            });
        }
    }

    render = () => {
        if(!this.props.item) return null;

        return (
            <View style={ [styles.container, this.props.containerStyle ?? {}] }>
                <View style={ styles.textContainer }>
                    <Text style={ [styles.text, styles.title, this.props.titleStyle ?? {}] }>{ this.props.item.name }</Text>
                    {
                        !this.state.availableCheck &&
                        <Text style={ [styles.text, this.props.textStyle ?? {}] }>У наявності: { this.props.item.available } шт.</Text>
                    }
                    {
                        this.state.available &&
                        <Text style={ [styles.text, this.props.textStyle ?? {}] }>{ this.state.available }</Text>
                    }
                    <Text style={ [styles.text, this.props.textStyle ?? {}] }>Ціна: { this.props.item.price }&nbsp;&#8372;</Text>
                    {
                        this.state.availableCheck && !this.state.available &&
                        <CheckAvailableButton
                                onPressAsync={ this.checkAvailable }
                                buttonStyle={ this.props.buttonStyle }
                                buttonTextStyle={ this.props.buttonTextStyle } 
                            />
                    }
                    
                    <CustomizedButton
                            title='У магазин'
                            onPress={ this.openUrl }
                            buttonStyle={ [styles.button, this.props.buttonStyle ?? {}] }
                            textStyle={ [styles.buttonText, this.props.buttonTextStyle ?? {}] }
                        />
                </View>
                { this.state.imageSource && 
                    <Image
                            source={ this.state.imageSource }
                            style={ styles.image }
                        /> 
                }
                { this.props.item.datasheet && 
                    <DatasheetButton onPress={ this.props.onSpecPress } />
                }
                <Ionicons 
                        style={ styles.icon }
                        name={ this.props.isFavourite === true ? 'star' : 'star-outline' }
                        size={ this.props.favouriteSize ?? 24 } 
                        color={ this.props.favouriteColor ?? '#007AFF' } 
                        onPress={ this.props.onFavouritePress }
                    /> 
            </View>
        );
    }
}

/*
const SearchResultItem = ({ 
    item, 
    containerStyle, 
    titleStyle, 
    textStyle, 
    buttonStyle, 
    buttonTextStyle, 
    favouriteColor, 
    favouriteSize, 
    isFavourite, 
    onFavouritePress, 
    onSpecPress, 
    onCheckAvailablePress 
}) => {
    const [imageSource, setImageSource] = useState(null);
    const [available, setAvailable] = useState(null);
    const [availableCheck, setAvailableCheck] = useState(false);

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
        const res = await onCheckAvailablePress(item);
        if(res === true) {
            setAvailable('Є в наявності');
        } else {
            setAvailable('Немає в наявності');
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
                    <CheckAvailableButton
                            onPressAsync={ checkAvailable }
                            buttonStyle={ buttonStyle }
                            buttonTextStyle={ buttonTextStyle } 
                        />
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
                <DatasheetButton onPress={ onSpecPress } />
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

*/
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
    }
});

export default SearchResultItem;
