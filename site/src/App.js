import React, {useState} from "react";
import './App.css';
import Navbar from "./components/navbar/navbar";
import MapComponent from './components/map/mapComponent'
import Sidebar from './components/sidebar/sidebar'


function App() {
  return (
    <div className="App">
      <div className="navbar"><Navbar/></div>
      <div className="sidebar"><Sidebar/></div>
      <div className="mapcomponent"><MapComponent/></div>
    </div>
  );
}

export default App;
