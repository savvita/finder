import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ShopResultListItem = ({ title, onPress, containerStyle, textStyle }) => {
    return (
        <TouchableOpacity
            style={ [styles.headerContainer, containerStyle ?? {}] }
            onPress={ onPress }>
            <Text style={ [styles.title, textStyle ?? {}] }>{ title }</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#aaa',
        borderTopWidth: 1,
        borderTopColor: '#aaa'
    },
    title: {
        fontFamily: 'mt-bold'
    }
});

export default ShopResultListItem;