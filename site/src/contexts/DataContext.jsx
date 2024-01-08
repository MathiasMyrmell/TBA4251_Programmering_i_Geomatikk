import React, { createContext, useContext, useEffect, useState } from 'react';
import uniqBy from 'lodash/uniqBy';
import _ from 'lodash';

import * as turf from '@turf/turf';


//Analyses
import FeatureSelection from "../components/content/analysisMenu/analyses/featureSelection/featureSelection.jsx";
import BufferAnalysis from "../components/content/analysisMenu/analyses/buffer/bufferAnalysis.jsx";
import IntersectAnalysis from "../components/content/analysisMenu/analyses/intersection/intersectAnalysis.jsx";
import UnionAnalysis from "../components/content/analysisMenu/analyses/union/unionAnalysis.jsx";
import DifferenceAnalysis from "../components/content/analysisMenu/analyses/differrence/differenceAnalysis.jsx";
import CreateLayer from "../components/content/analysisMenu/analyses/createLayer/createLayer.jsx";

const DataContext = createContext(undefined);
const analyses = {
  "featureSelection" : {
      name:"Feature Analysis",
      analysis: <FeatureSelection/>
  },
  "bufferAnalysis":{
    name: "Buffer Analysis",
    analysis: <BufferAnalysis/>
  },
  "intersectAnalysis":{
    name: "Intersect Analysis",
    analysis: <IntersectAnalysis/>
  },
  "unionAnalysis":{
    name: "Union Analysis",
    analysis: <UnionAnalysis/>
  },
  "differenceAnalysis":{
    name: "Difference Analysis",
    analysis: <DifferenceAnalysis/>
  },
  "createLayer":{
    name: "Create Layer",
    analysis: <CreateLayer/>
  }
}

const DataProvider = ({ children }) => {
  const [data, setDataRaw] = useState([]);
  const [showContainer, setShowContainer] = useState("none");
  const [backgroundContent, setBackgroundContent] = useState(null);
  const [hideContentElements, setHideContentElements] = useState(false);


  ////Functions for handling layers
  // Add new layer to data
  const setData = (item, i = null) => {
    let layer = addPropertiesToLayer(item)
    if(i === null){
      setDataRaw(data => uniqBy([...data, layer], 'id'));
    }else{
      setDataRaw(data => uniqBy([...data.slice(0, i), layer, ...data.slice(i + 1)], 'id'));
    }
  }

  // Update data with new data
  //TODO: check if necessary
  const updateData = (newData) => {
    setDataRaw(newData)
  }

  // Remove one data entry
  function removeData(id){
    updateData(data.filter(item => item.id !== id))
}

  // Remove all data
  const clearData = () => {
    setDataRaw([])
  }

  function addPropertiesToLayer(layer){
    let newLayerData = turf.featureCollection([])
    for(let i = 0; i < layer.data.features.length; i++){
      let newFeature = {
        "type": "Feature",
        "properties": {
          "Shape_Area": turf.area(layer.data.features[i]),
          "Type": layer.data.features[i].properties.Type !== undefined ? layer.data.features[i].properties.Type : "Area"
        },
        "geometry": layer.data.features[i].geometry
      }

      newLayerData.features.push(newFeature)
    }

    layer.data = newLayerData
    layer.colour === "" ? layer.colour = getRandomColour() : layer.colour = layer.colour
    return layer
  }

  ////Functions for analysis 
  const [analysis, setAnalysis] = useState("none");
  const [showAnalysis, setShowAnalysis] = useState("none")
  const [showCreateLayerMode, setShowCreateLayerMode] = useState(false)
  const [showAnalysisMenu, setShowAnalysisMenu] = useState("block")
  const [markers, setMarkers] = useState([]);

  //Get random colour for layer colour
  function getRandomColour(){
    var letters = '0123456789ABCDEF';
    var colour = '#';
    for (var i = 0; i < 6; i++) {
      colour += letters[Math.floor(Math.random() * 16)];
    }
    return colour;
  }


//Prepare layers for analysis where two layers are required.
//Makes sure the layers are on a standard format
function prepareLayersForAnalysis(firstLayer, secondLayer){
  let fL = data.find((layer) => layer.id === firstLayer.value);
  let sL = data.find((layer) => layer.id === secondLayer.value);


  // Dissolve layers
  fL.data = _dissolveLayer(fL.data)
  sL.data = _dissolveLayer(sL.data)

  return [fL, sL]
}

// Dissolve layer
function _dissolveLayer(layer){
  let featureCollection = _splitMultiPolygon(layer)

  let dissolved = _dissolve(featureCollection)
  return dissolved
}

//Splits multipolygons into polygons
//Some Turf functions cant handle multipolygons
function _splitMultiPolygon(layer){
  let featureCollection = turf.featureCollection()
  let newFeatures = []
  for(let i = 0; i<layer.features.length; i++){
      let feature = layer.features[i]
      if(feature.geometry.type == "MultiPolygon"){
          for(let j = 0; j<feature.geometry.coordinates.length; j++){
              let polygon = turf.polygon(feature.geometry.coordinates[j])
              newFeatures.push(polygon)
          }
      }else{
          newFeatures.push(feature)
      }
  }
  featureCollection.features = newFeatures
  return featureCollection
}

//Dissolve a feature collection into fewer features
function _dissolve(featureCollection){
  let dissolved
  try{
      dissolved = turf.dissolve(featureCollection)
  }
  catch(err){
      dissolved = null
  }
  if(dissolved !== null){
      return dissolved
  }
  //Split featur collection into two lists
  let split = Math.floor(featureCollection.features.length/2)
  let firstPart = featureCollection.features.slice(0,split)
  let secondPart = featureCollection.features.slice(split, featureCollection.features.length)
  let fC1 = turf.featureCollection(firstPart)
  let fC2 = turf.featureCollection(secondPart)
  let dissolved1 = _dissolve(fC1)
  let dissolved2 = _dissolve(fC2)
  let dissolvedFeatures = dissolved1.features.concat(dissolved2.features)
  dissolved = turf.featureCollection(dissolvedFeatures)
  return dissolved
}


  //Functions for createlayer analysis
  //Markers has to be accessed by both analysis context and data context
  
  
  useEffect(() => {
    if(showCreateLayerMode ){
      setShowAnalysisMenu("none");
      setHideContentElements(true);
    }else{
      setHideContentElements(false);
      setShowAnalysisMenu("inline");
    }
  }, [showCreateLayerMode])

  function displayAnalysis(analysisName){
    if(analysisName === "none"){
      setAnalysis("none")
      setShowAnalysis("none")
    }
    setAnalysis(analyses[analysisName])
    setShowAnalysis("block")
  } 
   
  const value = [data, setData, removeData, analysis, prepareLayersForAnalysis, displayAnalysis,showAnalysis, setShowAnalysis, analyses, showAnalysisMenu, setShowAnalysisMenu, showCreateLayerMode, setShowCreateLayerMode, showContainer, setShowContainer,backgroundContent, setBackgroundContent, hideContentElements, setHideContentElements, markers, setMarkers];

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default useData;
export { DataProvider, useData };