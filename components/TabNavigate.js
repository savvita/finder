import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getHeaderTitle } from '@react-navigation/elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchScreen from "../screens/SearchScreen";
import ParametersSearchScreen from '../screens/ParametersSearchScreen';
import Header from '../components/Header';


const TabNavigate = () => {
    const Tab = createBottomTabNavigator();

    const shopSearching = 'Пошук у магазинах';
    const paramSearching = 'Пошук за параметрами';
    return (
            <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                          let iconName;
              
                          if (route.name === 'search_screen') {
                            iconName = focused
                              ? 'search'
                              : 'search-outline';
                          } else if (route.name === 'param_searching_screen') {
                            iconName = focused ? 'list-circle' : 'list-circle-outline';
                          }
              
                          return <View style={{ paddingTop: 10 }}><Ionicons name={ iconName } size={ size } color={ color } /></View>;
                        },
                        tabBarActiveTintColor: '#bfffd0',
                        tabBarInactiveTintColor: '#ddd',
                        header: ({ navigation, route, options }) => {
                            const title = getHeaderTitle(options, route.name);
                          
                            return (
                                <Header 
                                        title={ title } 
                                        containerStyle={ options.headerStyle }
                                        isSettings={ true }
                                        isFavourite={ true }
                                        onSettingsPress={ () => navigation.navigate('settings') }
                                        onFavouritesPress={ () => navigation.navigate('favourites') }
                                    />);
                        },
                        tabBarStyle: { backgroundColor: '#333', height: 60 },
                        tabBarLabelStyle: {
                            paddingBottom: 10
                        }
                      })}
                >
                <Tab.Screen
                        name='search_screen'
                        options={{
                            title: shopSearching,
                            tabBarLabel: shopSearching
                        }}
                        component={ SearchScreen }
                    />
                <Tab.Screen
                        name={ 'param_searching_screen' }
                        component={ ParametersSearchScreen }
                        options={{
                            title: paramSearching,
                            tabBarLabel: paramSearching
                        }}
                    />
            </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#333'
    },
    headerTitle: {

    }
});

export default TabNavigate;