import { SafeAreaView, StyleSheet } from "react-native";
import Navigate from "./components/Navigate";

function App(): JSX.Element {

  return (
    <SafeAreaView style={ styles.container }>
      <Navigate />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40
  }
});

export default App;
