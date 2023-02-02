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


  function featureSelection(close){
    var analysisWindow = document.getElementById("analysisWindow");
    var analysisWindowContainer = document.getElementById("analysisWindowContainer");
    if(close){
      analysisWindow.style.display = "block";
      let containerHeight = analysisWindowContainer.clientHeight;
      let paddingTop = (height/2)-(containerHeight/2);
      analysisWindowContainer.style.marginTop = paddingTop + "px";
      analysisWindowContainer.style.marginBottom = paddingTop + "px";
    }else{
      clearInput();
      analysisWindow.style.display = "none";

    }
  }

  //Chose layer for feature selection
  function choseLayer(target){
    setLayer(target);
    let layerData = data.find((layer) => layer.id === target.value).data.features;
    // console.log(layerData);
    filterFeatures(layerData);
  }

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


  ////Buffer analysis
  function bufferAnalysis(){
    console.log("buffer analysis")
    var point = turf.point([10.538810010949685,63.42153656907081]);
    var layer = arealbruk;
    var buffered = turf.buffer(layer, 100, {units: 'meters'});
    // console.log("buffered")
    // console.log(buffered)
    var dataSet = createDataSet(buffered);
    let newLayer = {id:uuid(), name:"bufferAnalysis", colour:"red", data:dataSet, value:true};
    // console.log("newLayer");
    // console.log(newLayer);
    setData(newLayer);
  }

  function createDataSet(dataSet){
    // console.log("oldDataSet");
    // console.log(dataSet);
    let newDataSet = {type:"FeatureCollection", features:[dataSet]};
    return newDataSet;
  }



  return (
    <>
      <div id = "analysisContainer">
        <button className="button" onClick={()=>featureSelection(true)}>Feature Selection</button>
        <button onClick={()=> bufferAnalysis()}>Buffer analysis</button>
      </div>
      <div id = "analysisWindow" style={{display: "None"}} >{/*onClick={() => featureSelection(false)}*/}
        <div id = "analysisWindowContainer">
          <button id = "closeButton" onClick={() => featureSelection(false)}>Close</button>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-simple-select-label">Layer</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="select"
              value={layer.value}
              label="Layer"
              onChange={(e) => choseLayer(e.target)}
            >
              <MenuItem id="chosenColour" key={uuid()} >
                <em></em>
              </MenuItem>
              {data.map((layer) => (
                <MenuItem
                    key={layer.id}
                    value={layer.id}
                >
                    {layer.name}
                </MenuItem>
                
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">Features</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="featureSelect"
                multiple
                value={chosenFeatures}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                label="Features"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {features.map((feature) => (
                  <MenuItem
                    key={uuid()}
                    value={feature}
                    style={getStyles(feature, chosenFeatures, theme)}
                  >
                    {feature}
                  </MenuItem>
                ))}
              </Select>
          </FormControl>
          <button id="executeAnalysis" onClick={()=> createNewLayer()}>Select features</button>
        </div>
      </div>
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
