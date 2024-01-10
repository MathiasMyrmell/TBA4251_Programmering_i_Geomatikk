import React from "react";
import Content from "./components/content";
import { DataProvider } from "./contexts/DataContext";
import { AppContainer } from "./styles/styles";

function App() {
  return (
    <AppContainer>
      <DataProvider>
        <Content />
      </DataProvider>
    </AppContainer>
  );
}

export default App;
