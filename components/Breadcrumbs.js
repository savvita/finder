import { View, StyleSheet, Text } from 'react-native';
import BreadcrumbItem from './BreadcrumbItem';

const Breadcrumbs = ({ items, onPress}) => {
    const press = (item) => {
        onPress && onPress(item);
    }

    if(!items) return null;

    return (
        <View style={ styles.container }>
            { items.map((item, index) =>
                <View key={ index } style={ { flexDirection: 'row' } }>
                    <BreadcrumbItem
                            item={ item.title }
                            onPress={ () => press(item) }
                            textStyle={ styles.text }
                        />
                    { index !== items.length - 1 && <Text style={ [styles.text, styles.separator] }>/</Text> }
                </View>
            ) }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    separator: {
        paddingHorizontal: 5
    },
     text: {
        fontSize: 18,
        fontWeight: 'bold'
     }
});

export default Breadcrumbs;