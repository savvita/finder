import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const BreadcrumbItem = ({ item, onPress, textStyle }) => {
    if(!item) return null;

    return (
        <TouchableOpacity onPress={ onPress }>
            <Text style={ textStyle }>{ item }</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

});

export default BreadcrumbItem;