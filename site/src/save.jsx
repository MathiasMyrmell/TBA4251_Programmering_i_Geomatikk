import React, {useState} from "react";
// import './App.css';
// import Navbar from "./components/navbar/navbar";
import Content from "./components/content/content";
import ThemeContext, {themes} from "./contexts/theme";
import { Box } from "@mui/system";
import { DataProvider } from "./contexts/DataContext";

import {AppContainer, SideBarContainer, FileContainer} from "./components/muiElements/mainComponents";

function Save() {
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

export default Save;

      {/* <div id="App"> */}
        {/* <div id="navbar" className="appComponents"><Navbar/></div> */}
        {/* <div id="content" className="appComponents"><Content/></div> */}
      {/* </div> */}
