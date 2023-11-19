import { colors } from '../styles/colors';
import { createContext, useState, useEffect} from 'react';
import preferences from '../data/preferences';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [isLightTheme, setLightTheme] = useState(true);

    useEffect(() => {
        const getTheme = async () => {
            setLightTheme(await preferences.getTheme() === 'light');
        }

        getTheme();
    }, []);

    const toggleTheme = () => setLightTheme(previousState => !previousState);
    const theme = {
        colors: isLightTheme ? colors.light : colors.dark,
        toggleTheme,
        isLightTheme
    };

    return (
        <ThemeContext.Provider value={ theme }>
            { children }
        </ThemeContext.Provider>    
    );
}

export default ThemeProvider;