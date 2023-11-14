import { TouchableOpacity, Text, StyleSheet } from "react-native";


export default CustomizedButton = ({ title, buttonStyle, textStyle, onPress }) => {
    return (
        <TouchableOpacity 
                style={ [defaultStyles.button, buttonStyle ?? {} ] }
                onPress={ onPress }>
            <Text style={ [defaultStyles.text, textStyle ?? {} ] }>{ title }</Text>
        </TouchableOpacity>
    );
}

const defaultStyles = StyleSheet.create(
    {
        button: {
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#777',
            borderRadius: 5
        },
        text: {
            color: '#333',
            fontSize: 14,
            paddingHorizontal: 10,
            paddingVertical: 7,
            textAlign: 'center'
        }
    }
);