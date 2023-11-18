import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Header from '../components/Header';

import { createStackNavigator } from '@react-navigation/stack';
import TabNavigate from './TabNavigate';
import SettingsScreen from '../screens/SettingsScreen';

const Navigate = () => {
    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                        name="content"
                        component={ TabNavigate }
                        options={{
                            headerShown: false
                        }}
                    />
                <Stack.Screen
                        name="settings"
                        component={ SettingsScreen }
                        options={{
                            title: 'Налаштування',
                            header: (props) => <Header title={ props.options.title } isBack={ true } isSettings={ false }                                         onBackPress={ () => props.navigation.navigate('content') } />
                        }}
                    />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#333'
    },
    headerTitle: {

    }
});

export default Navigate;