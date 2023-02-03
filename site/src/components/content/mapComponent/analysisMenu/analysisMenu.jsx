import React from "react";
import { useState, useEffect } from 'react';
import "./analysisMenu.css";
import { useData } from "../../../../contexts/DataContext";
import { Card, Checkbox, Box, Chip,  FormControl, InputLabel, Select, MenuItem, OutlinedInput, Input, InputAdornment  } from "@mui/material";
import { v4 as uuid } from "uuid";
import uniqBy from 'lodash/uniqBy';
import { featureGroup } from "leaflet";

import { useTheme } from '@mui/material/styles';
import { LayersControl } from "react-leaflet";
import _ from "lodash";

import * as turf from '@turf/turf'
import { clustersDbscan, point } from '@turf/turf';


import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import arealbruk from "../../../../files/arealbruk.json";


import FeatureSelection from "./featureSelection/featureSelection";
import excludeVariablesFromRoot from "@mui/material/styles/excludeVariablesFromRoot";
import BufferAnalysis from "./bufferAnalysis/bufferAnalysis";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}




function AnalysisMenu() {
  const { height, width } = useWindowDimensions();
  const [layer, setLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
  const [features, setFeatures] = useState([]);
  const [chosenFeatures, setChosenFeatures] = useState([]);
  const [data, setData, clearData, removeItemFromData, handleCheckboxChange, handleColourChange] = useData()
  const [fSShow, setfSShow] = useState("none");
  const [bAShow, setbAShow] = useState("none");


  //Chose layer for feature selection
  // function choseLayer(target){
  //   setLayer(target);
  //   let layerData = data.find((layer) => layer.id === target.value).data.features;
  //   // console.log(layerData);
  //   filterFeatures(layerData);
  // }

  //Filter features
  function filterFeatures(data){
    setFeatures([]);
    let newFeatures = [];
    newFeatures.push(data[0].properties.OBJTYPE)
    compareLoop: for( let i = 0; i < data.length; i++){
      let newFeature = data[i].properties.OBJTYPE;
      for(let j = 0; j <newFeatures.length; j++){
        if(newFeatures[j] === newFeature){
          continue compareLoop
        }
      }
      newFeatures.push(newFeature);
  }
  for(let i = 0; i < newFeatures.length; i++){
    setFeatures(features => [...features, newFeatures[i]]);
  }
  }


  //Create new layer with selected features
  function createNewLayer(){
    let baseLayer = data.find((l) => l.id === layer.value);
    console.log(baseLayer);
    let newFeatures = [];
    console.log(chosenFeatures);
    baseLayer.data.features.map(feature => {
      if(_.includes(chosenFeatures,feature.properties.OBJTYPE)){
        newFeatures.push(feature);
      }
    })
    let newData = {tye:"FeatureCollection", features:newFeatures};
    let newLayer = {id:uuid(), name:baseLayer.name+"-feature-selecion", colour:"", data:newData, value:true};
    console.log(newLayer);
    setData(newLayer);
    clearInput();
  }


  function clearInput(){
    setChosenFeatures([]);
    setLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
    setFeatures([]);
  }
 

  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setChosenFeatures(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };




  function createDataSet(dataSet){
    // console.log("oldDataSet");
    // console.log(dataSet);
    let newDataSet = {type:"FeatureCollection", features:[dataSet]};
    return newDataSet;
  }

  function displayAnalysisWindow(show){
    if(show == "featureSelection"){
      setfSShow("block");
      console.log("fSShow");
      console.log(fSShow);
    }else if(show == "bufferAnalysis"){
      setbAShow("block");
    }
    else if(show=="close"){
      setfSShow("none");
      setbAShow("none");
    }
  }
  function centerAnalysisWindow(){
    let analysisWindowContainer = document.getElementById("analysisWindowContainer");
    let analysisWindowWidth = analysisWindowContainer.offsetWidth;
    let analysisWindowHeight = analysisWindowContainer.offsetHeight;

    let x = (width/2)-(analysisWindowWidth/2);
    let y = (height/2)-(analysisWindowHeight/2);
    analysisWindowContainer.style.marginLeft = x+"px";
    analysisWindowContainer.style.marginTop = y+"px";
}

useEffect(() => {
  centerAnalysisWindow();
}, [width, height]);

  return (
    <>
      <div id = "analysisContainer">
        <button className="button" onClick={() => displayAnalysisWindow("featureSelection")}>Feature Selection</button>
        <button className="button" onClick={() => displayAnalysisWindow("bufferAnalysis")}>Buffer analysis</button>
      </div>
      <BufferAnalysis display = {bAShow} displayAnalysisWindow = {displayAnalysisWindow}/>
      <FeatureSelection display = {fSShow} displayAnalysisWindow = {displayAnalysisWindow}/>
      
    </>
    )
}

export default AnalysisMenu;



function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
