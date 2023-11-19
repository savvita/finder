import Navigate from "./components/Navigate";
import ThemeProvider from "./theme/ThemeProvider";

function App(): JSX.Element {

  return (
    <ThemeProvider>
      <Navigate />
    </ThemeProvider>
  );
}

export default App;
