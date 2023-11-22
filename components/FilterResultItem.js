import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import CustomizedButton from './CustomizedButton';

class FilterResultItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: null
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
    }

    render = () => {
        if(!this.props.item) return null;

        return (
            <TouchableOpacity style={ [styles.container, this.props.containerStyle ?? {}] }>
                <View style={ styles.textContainer }>
                    <Text style={ [styles.text, styles.title, this.props.textStyle ?? {}] }>{ this.props.item.name }</Text>
                    <CustomizedButton
                            buttonStyle={ [styles.button, this.props.buttonStyle] }
                            textStyle={ [styles.buttonText, this.props.buttonTextStyle] }
                            title='Перейти до пошуку'
                            onPress={ this.props.onPress }
                        />
                </View>
                { this.state.imageSource && 
                    <Image
                            source={ this.state.imageSource }
                            style={ styles.image }
                        /> 
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        padding: 10,
        borderColor: '#777',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
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
        marginTop: 10,
        backgroundColor: '#333'
    },
    buttonText: {
        color: '#fff'
    }
});

export default FilterResultItem;