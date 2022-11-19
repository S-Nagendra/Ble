import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/RootNavigator";

const App = (props) => {
  return(
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}

export default App;