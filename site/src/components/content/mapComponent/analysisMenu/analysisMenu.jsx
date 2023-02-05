import React from "react";
import { useState, useEffect } from 'react';
import "./analysisMenu.css";
import { v4 as uuid } from "uuid";

import _ from "lodash";

import { useData } from "../../../../contexts/DataContext";

import AnalysisContainer from "./analysis/analysisContainer";
import FeatureSelection from "./featureSelection/featureSelection";
import BufferAnalysis from "./bufferAnalysis/bufferAnalysis";

import { AnalysisButton, AnalysisMenuContainer } from "../../../muiElements/styles";


function AnalysisMenu() {

  const [data, setData,layer, setLayer, chosenFeatures, setChosenFeatures, analysis, setAnalysis] = useData()
  const [show, setShow] = useState("none");


  function displayAnalysisWindow(show){

    if(show == "featureSelection"){//analysis = {<FeatureSelectionC />}
      setAnalysis({name: "Feature Analysis", analysis: <FeatureSelection displayAnalysisWindow = {displayAnalysisWindow}/>});
      setShow("block");
    }
    // if(show == "featureSelection"){
    //   setfSShow("block");
    else if(show == "bufferAnalysis"){
      setAnalysis({name: "Buffer Analysis", analysis: <BufferAnalysis  displayAnalysisWindow = {displayAnalysisWindow}/>});
      setShow("block");
    }
    else if(show=="close"){
 
      setShow("none");
    }
  }



  return (
    <>
      <AnalysisMenuContainer >
        <AnalysisButton onClick={() => displayAnalysisWindow("featureSelection")}>Feature Selection</AnalysisButton>
        <AnalysisButton onClick={() => displayAnalysisWindow("bufferAnalysis")}>Buffer analysis</AnalysisButton>
      </AnalysisMenuContainer>
      {/* <BufferAnalysis display = {bAShow} displayAnalysisWindow = {displayAnalysisWindow}/>
      <FeatureSelection display = {fSShow} displayAnalysisWindow = {displayAnalysisWindow}/> */}
      {/* <AnalysisContainer display = {fSShow} analysis ={<BufferAnalysisC />} displayAnalysisWindow = {displayAnalysisWindow}/> */}
      
      <AnalysisContainer display = {show} name = {analysis.name} analysis ={analysis.analysis} displayAnalysisWindow = {displayAnalysisWindow}/>
      
    </>
    )
}

export default AnalysisMenu;