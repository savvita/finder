import { createStackNavigator } from '@react-navigation/stack';
import CategoriesScreen from './CategoriesScreen';
import FiltersScreen from './FiltersScreen';
import FiltersResultsScreen from './FiltersResultsScreen';

const ParametersSearchScreen = () => {
    const Stack = createStackNavigator();
    
    return (
        <Stack.Navigator>
            <Stack.Screen
                    name="categories"
                    component={ CategoriesScreen }
                    options={{
                        headerShown: false
                    }}
                />
            <Stack.Screen
                    name="filters"
                    component={ FiltersScreen }
                    options={{
                        title: 'Фільтри'
                    }}
                />
            <Stack.Screen
                    name="filters_results"
                    component={ FiltersResultsScreen }
                    options={{
                        title: 'Результати пошуку'
                    }}
                />


        </Stack.Navigator>
    );
}

export default ParametersSearchScreen;