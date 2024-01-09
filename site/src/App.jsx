import React from "react";
import './App.css';
import Content from "./components/content/content";
import ThemeContext, {themes} from "./contexts/theme";
import { DataProvider } from "./contexts/DataContext";
import {AppContainer} from "./components/muiElements/styles";

function App() {
  return (
    <ThemeContext.Provider value={themes.standard}>
        <AppContainer id="App">
          <DataProvider>
            <Content />
          </DataProvider>
        </AppContainer>
    </ThemeContext.Provider>
  );
}

export default App;


