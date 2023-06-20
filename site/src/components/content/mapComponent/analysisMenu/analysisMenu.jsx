import React from "react";
import { useState, useEffect } from 'react';
import { v4 as uuid } from "uuid";

import _ from "lodash";

import { useData } from "../../../../contexts/DataContext";

import AnalysisContainer from "./analysis/analysisContainer";
import FeatureSelection from "./featureSelection/featureSelection";
import BufferAnalysis from "./bufferAnalysis/bufferAnalysis";
import IntersectAnalysis from "./intersectAnalysis/intersectAnalysis";
import UnionAnalysis from "./unionAnalysis/unionAnalysis";

import { AnalysisButton, AnalysisMenuContainer } from "../../../muiElements/styles";


function AnalysisMenu() {

  const [data, setData,layer, setLayer, chosenFeatures, setChosenFeatures, analysis, setAnalysis] = useData()
  const [show, setShow] = useState("none");


  function displayAnalysisWindow(show){

    if(show == "featureSelection"){
      setAnalysis({name: "Feature Analysis", analysis: <FeatureSelection displayAnalysisWindow = {displayAnalysisWindow}/>});
      setShow("block");
    }

    else if(show == "bufferAnalysis"){
      setAnalysis({name: "Buffer Analysis", analysis: <BufferAnalysis  displayAnalysisWindow = {displayAnalysisWindow}/>});
      setShow("block");
    }
    else if(show == "intersectAnalysis"){
      setAnalysis({name: "Intersect Analysis", analysis: <IntersectAnalysis  displayAnalysisWindow = {displayAnalysisWindow}/>});
      setShow("block");
    }else if(show == "unionAnalysis"){
      setAnalysis({name: "Union Analysis", analysis: <UnionAnalysis  displayAnalysisWindow = {displayAnalysisWindow}/>});
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
        <AnalysisButton onClick={() => displayAnalysisWindow("bufferAnalysis")}>Buffer Analysis</AnalysisButton>
        <AnalysisButton onClick={() => displayAnalysisWindow("intersectAnalysis")}>Intersection Analysis</AnalysisButton>
        <AnalysisButton onClick={() => displayAnalysisWindow("unionAnalysis")}>Union Analysis</AnalysisButton>
      </AnalysisMenuContainer>

      <AnalysisContainer display = {show} name = {analysis.name} analysis ={analysis.analysis} displayAnalysisWindow = {displayAnalysisWindow}/>
      
    </>
    )
}

export default AnalysisMenu;