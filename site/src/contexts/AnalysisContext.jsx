import React, { createContext, useContext, useState } from 'react';

import { useData } from "./DataContext";

//Analyses
import FeatureSelection from "../components/content/analysisMenu/analyses/featureSelection/featureSelection.jsx";
import BufferAnalysis from "../components/content/analysisMenu/analyses/buffer/bufferAnalysis.jsx";
import IntersectAnalysis from "../components/content/analysisMenu/analyses/intersection/intersectAnalysis.jsx";
import UnionAnalysis from "../components/content/analysisMenu/analyses/union/unionAnalysis.jsx";
import DifferenceAnalysis from "../components/content/analysisMenu/analyses/differrence/differenceAnalysis.jsx";

//Div
import * as turf from '@turf/turf';


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
  }
}

const AnalysisContext = ({ children }) => {
  const [data, setData, layer, setLayer, clearData, updateData] = useData()
  const [analysis, setAnalysis] = useState("none");
  const [showAnalysis, setShowAnalysis] = useState("none")

  function displayAnalysis(analysisName){
    if(analysisName === "none"){
      setAnalysis("none")
      setShowAnalysis("none")
    }
    setAnalysis(analyses[analysisName])
    setShowAnalysis("block")
  }

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

  // Add area to feature
  function addAreaToFeature(feature){
    feature.properties = {Shape_Area:0}
    let area = turf.area(feature);
    feature.properties.Shape_Area = area;
    return feature;
}


  // Returning values and functions
  const value = [analysis, displayAnalysis,showAnalysis, setShowAnalysis, analyses, prepareLayersForAnalysis, addAreaToFeature];

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

const useAnalysis = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default useAnalysis;
export { AnalysisContext, useAnalysis };