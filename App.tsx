import Navigate from "./components/Navigate";
import { useEffect } from 'react';
import ThemeProvider from "./theme/ThemeProvider";
import SplashScreen from 'react-native-splash-screen';

function App(): JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <ThemeProvider>
      <Navigate />
    </ThemeProvider>
  );
}

export default App;
