import { View, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({ title, containerStyle, textStyle, onSettingsPress, isBack, isSettings, isFavourite, onBackPress, onFavouritesPress }) => {

    return (
        <View style={ [styles.container, containerStyle ?? {}] }>
            <View style={{ flexDirection: 'row' } }>
            { isBack === true && <Ionicons 
                    name='arrow-back' 
                    size={ 26 } 
                    color={ '#fff' } 
                    onPress={ onBackPress }
                    style={{ marginEnd: 10}}
                /> }
            <Text style={ [styles.text, textStyle ?? {}] }>{ title }</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                { isFavourite === true && <Ionicons 
                        name='star' 
                        size={ 26 } 
                        color={ '#fff' } 
                        onPress={ onFavouritesPress }
                        style={{ marginStart: 10 }}
                    /> }
                { isSettings === true && <Ionicons 
                        name='settings-outline' 
                        size={ 26 } 
                        color={ '#fff' } 
                        onPress={ onSettingsPress }
                        style={{ marginStart: 10 }}
                    /> }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333',
        paddingHorizontal: 15,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 22,
        color: '#fff'
    }
});

export default Header;