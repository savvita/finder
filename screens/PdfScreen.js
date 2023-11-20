import { View, StyleSheet, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import useTheme from '../theme/useTheme';
import useThemedStyles from '../theme/useThemedStyles';

const PdfScreen = ({ route }) => {
    const theme = useTheme();
    const style = useThemedStyles(styles);

    if(!route || !route.params || !route.params.url) {
        return null;
    }

    return (
        <View style={ style.container }>
            <Pdf
                    source={ { uri: route.params.url } }
                    style={ style.pdf }
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    trustAllCerts={ false }
                />
        </View>
    );
}

const styles = theme => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.BACKGROUND
    },
    pdf: {
        flex: 1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});

export default PdfScreen;