import React from "react";
import { AppRegistry } from "react-native";
import App from "./src/App";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { name as appName } from "./app.json";
import store from "./src/redux/store.js";

const Main = () => (
  <ReduxProvider store={store}>
    <PaperProvider>
      <App />
    </PaperProvider>
  </ReduxProvider>
);

AppRegistry.registerComponent(appName, () => Main);
