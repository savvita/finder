import { Text, TouchableOpacity } from 'react-native';

const BreadcrumbItem = ({ item, onPress, textStyle }) => {
    if(!item) return null;

    return (
        <TouchableOpacity onPress={ onPress }>
            <Text style={ textStyle }>{ item }</Text>
        </TouchableOpacity>
    );
}

export default BreadcrumbItem;