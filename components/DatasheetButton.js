import { TouchableOpacity, StyleSheet, Image } from 'react-native'


const DatasheetButton = ({ onPress }) => {
    return (
        <TouchableOpacity 
                style={ styles.container } 
                onPress={ onPress }>
            <Image
                    source={ require('../assets/images/pdf.png') }
                    style={ styles.icon }
                />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        bottom: 5
    },
    icon: {
        width: 40, 
        height: 40
    }
});

export default DatasheetButton;