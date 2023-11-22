import { useState } from 'react';
import { StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import CustomizedButton from "./CustomizedButton";

const CheckAvailableButton = ({ onPressAsync, buttonStyle, buttonTextStyle }) => {
    const [loading, setLoading] = useState(false);

    const checkAvailable = async () => {
        if (!onPressAsync) return;

        try {
            setLoading(true);
            await onPressAsync();
        } catch (e) {
            console.log(e)
            ToastAndroid.show('Не можу зв’язатися з сайтом', ToastAndroid.LONG);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 100);
        }
    }

    return (
        <CustomizedButton
            title='Перевірити наявність'
            onPress={ checkAvailable }
            buttonStyle={[styles.button, buttonStyle ?? {}]}
            textStyle={[styles.buttonText, buttonTextStyle ?? {}]}
            disabled={loading}
        >
            {loading === true && <ActivityIndicator color={buttonTextStyle?.color ?? '#00ff00'} />}
        </CustomizedButton>
    );
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: '#333',
        marginBottom: 3, 
        flexDirection: 'row', 
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff'
    }
});

export default CheckAvailableButton;