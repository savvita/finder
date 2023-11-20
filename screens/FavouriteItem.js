import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const FavouriteItem = ({ item, containerStyle, textStyle, onPress, deleteStyle, onDeletePress }) => {
    const renderRightActions = (progress, dragAnimatedValue) => {
        const opacity = dragAnimatedValue.interpolate({
            inputRange: [-150, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <View style={ styles.swipedRow }>
                <Animated.View style={[styles.deleteButton, { opacity }]}>
                    <TouchableOpacity onPress={ onDeletePress }>
                        <Text style={ [styles.deleteButtonText, deleteStyle ?? {}] }>Видалити</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };

    if (!item) return null;

    return (
        <Swipeable renderRightActions={ renderRightActions }>
            <TouchableOpacity style={[styles.container, containerStyle ?? {}]} onPress={onPress}>
                <View>
                    <Text style={[styles.title, textStyle ?? {}]}>{item.title}</Text>
                    <Text style={[textStyle ?? {}]}>{item.shop}</Text>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    swipedRow: {
        backgroundColor: '#dddddd22',
        justifyContent: 'center'
    },
    container: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    title: {
        fontSize: 16,
        fontWeight: '900'
    },
    deleteButtonText: {
        color: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    }
});

export default FavouriteItem;