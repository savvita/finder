import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchScreen from "../screens/SearchScreen";
import ParametersSearchScreen from '../screens/ParametersSearchScreen';


const Navigate = () => {
    const Tab = createBottomTabNavigator();

    const shopSearching = 'Пошук у магазинах';
    const paramSearching = 'Пошук за параметрами';
    return (
        <NavigationContainer>
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
              
                          return <Ionicons name={ iconName } size={ size } color={ color } />;
                        },
                        tabBarActiveTintColor: 'tomato',
                        tabBarInactiveTintColor: 'gray'
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