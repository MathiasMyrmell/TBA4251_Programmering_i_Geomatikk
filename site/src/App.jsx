import React, {useState} from "react";
import './App.css';
// import Navbar from "./components/navbar/navbar";
import Content from "./components/content/content";
import ThemeContext, {themes} from "./contexts/theme";


function App() {

  

  return (
    <ThemeContext.Provider value={themes.standard}>
      <div id="App">
        {/* <div id="navbar" className="appComponents"><Navbar/></div> */}
        <div id="content" className="appComponents"><Content/></div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
