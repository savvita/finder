import { createStackNavigator } from '@react-navigation/stack';
import CategoriesScreen from './CategoriesScreen';
import FiltersScreen from './FiltersScreen';
import FiltersResultsScreen from './FiltersResultsScreen';
import useTheme from '../theme/useTheme';

const ParametersSearchScreen = () => {
    const Stack = createStackNavigator();
    const theme = useTheme();
    
    return (
        <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.BACKGROUND,
                    },
                    headerTintColor: theme.colors.TEXT
                }}
            >
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