import { NavigationContainer } from '@react-navigation/native';
import Header from '../components/Header';

import { createStackNavigator } from '@react-navigation/stack';
import TabNavigate from './TabNavigate';
import SettingsScreen from '../screens/SettingsScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import PdfScreen from '../screens/PdfScreen';


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
                            header: (props) => 
                            <Header 
                                    title={ props.options.title } 
                                    isBack={ true } 
                                    isSettings={ false } isFavourite={ false }
                                    onBackPress={ () => props.navigation.navigate('content') } 
                                />
                        }}
                    />
                <Stack.Screen
                        name="favourites"
                        component={ FavouritesScreen }
                        options={{
                            title: 'Улюблене',
                            header: (props) => 
                                <Header 
                                        title={ props.options.title } 
                                        isBack={ true } 
                                        isSettings={ false } 
                                        isFavourite={ false }
                                        onBackPress={ () => props.navigation.navigate('content') } 
                                    />
                        }}
                    />
                <Stack.Screen
                        name="pdf"
                        component={ PdfScreen }
                        options={{
                            title: 'Специфікація',
                            header: (props) => 
                                <Header 
                                        title={ props.options.title } 
                                        isBack={ true } 
                                        isSettings={ false } 
                                        isFavourite={ false }
                                        onBackPress={ () => props.navigation.navigate('content') } 
                                    />
                        }}
                    />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default Navigate;