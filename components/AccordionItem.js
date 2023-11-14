import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";

import { useState } from 'react';



export default function AccordionItem({ title, children, headerContainerStyle, headerTitleStyle, iconStyle, onToggle }) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const icons = [
        require('../assets/images/up_icon.png'),
        require('../assets/images/down_icon.png')
    ];
    const [currentIcon, setCurrentIcon] = useState(icons[1]);

    const toggle = () => {
        setIsCollapsed(prev => !prev);
        setCurrentIcon(isCollapsed ? icons[0] : icons[1]);
        onToggle && onToggle();
    }

    return (
        <View style={{ maxHeight: '80%'}}>
            <TouchableOpacity
                style={ [styles.headerContainer, headerContainerStyle ?? {}] }
                onPress={ toggle }>
                <Text style={ [styles.title, headerTitleStyle ?? {}] }>{ title }</Text>
                <Image
                    source={ currentIcon }
                    style={ [styles.icon, iconStyle ?? {}] } />
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
    icon: {
        width: 20,
        height: 20
    },
    title: {
        fontFamily: 'mt-bold'
    }
});