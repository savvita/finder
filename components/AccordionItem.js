import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

import { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';



export default function AccordionItem({ title, children, headerContainerStyle, headerTitleStyle }) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggle = () => {
        setIsCollapsed(prev => !prev);
    }
    return (
        <View>
            <TouchableOpacity
                style={ [styles.headerContainer, headerContainerStyle ?? {}] }
                onPress={ toggle }>
                <Text style={ [styles.title, headerTitleStyle ?? {}] }>{ title }</Text>
                <Ionicons 
                        name={ isCollapsed ? 'chevron-down' : 'chevron-up'} 
                        size={ 24 } 
                        color={ headerTitleStyle?.color ?? '#007AFF' } 
                    /> 
            </TouchableOpacity>
            { !isCollapsed && children }
        </View>
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