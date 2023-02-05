import React, {useState} from "react";
import './App.css';
import Navbar from "./components/navbar/navbar";
import Content from "./components/content/content";



function App() {

  

  return (
    <div id="App">
      <div id="navbar" className="appComponents"><Navbar/></div>
      <div id="content" className="appComponents"><Content/></div>
    </div>
  );
}

export default App;
