import React from "react";
import { useState, useEffect } from 'react';
import "./analysisMenu.css";
import { v4 as uuid } from "uuid";

import _ from "lodash";



import FeatureSelection from "./featureSelection/featureSelection";
import BufferAnalysis from "./bufferAnalysis/bufferAnalysis";
import AnalysisContainer from "./analysis/analysisContainer";
import FeatureSelectionC from "./featureSelection/featureSelectionC";
import BufferAnalysisC from "./bufferAnalysis/bufferAnalysisC";

import { AnalysisButton, AnalysisMenuContainer } from "../../../muiElements/styles";


function AnalysisMenu() {
  const [fSShow, setfSShow] = useState("none");
  const [bAShow, setbAShow] = useState("none");

  function displayAnalysisWindow(show){
    if(show == "featureSelection"){
      setfSShow("block");
    }else if(show == "bufferAnalysis"){
      setbAShow("block");
    }
    else if(show=="close"){
      setfSShow("none");
      setbAShow("none");
    }
  }

  const analyses = [
    {
      name:"Feature Selection",
      id: uuid(),
      content: <FeatureSelectionC display = {fSShow} displayAnalysisWindow = {displayAnalysisWindow}/>,
      display: fSShow,
    },
    {
      name:"Buffer Analysis",
      id: uuid(),
      content: <BufferAnalysisC display = {bAShow} displayAnalysisWindow = {displayAnalysisWindow}/>,
      display: bAShow,
    }
  ]


  return (
    <>
      <AnalysisMenuContainer >
        <AnalysisButton onClick={() => displayAnalysisWindow("featureSelection")}>Feature Selection</AnalysisButton>
        <AnalysisButton onClick={() => displayAnalysisWindow("bufferAnalysis")}>Buffer analysis</AnalysisButton>
      </AnalysisMenuContainer>
      {/* <BufferAnalysis display = {bAShow} displayAnalysisWindow = {displayAnalysisWindow}/>
      <FeatureSelection display = {fSShow} displayAnalysisWindow = {displayAnalysisWindow}/> */}
      {/* <AnalysisContainer display = {fSShow} analysis ={<BufferAnalysisC />} displayAnalysisWindow = {displayAnalysisWindow}/> */}
      <ul>
        {analyses.map((analysis) => (
          <AnalysisContainer key={analysis.id} name = {analysis.name} display = {analysis.display} analysis ={analysis.content} displayAnalysisWindow = {displayAnalysisWindow}/>
        ))}
      </ul>
      
    </>
    )
}

export default AnalysisMenu;