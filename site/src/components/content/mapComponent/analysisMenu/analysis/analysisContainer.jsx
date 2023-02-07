import React from "react";
import { useState, useEffect } from 'react';
// import "./featureSelection.css";
import { useData } from "../../../../../contexts/DataContext";
import { useTheme } from '@mui/material/styles';

import { v4 as uuid } from "uuid";
import _ from "lodash";
import { AnalysisBackground, AnalysisC, DropDownMenu , ButtonIcon, Headings} from "../../../../muiElements/styles";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CloseIcon from '@mui/icons-material/Close';
import FeatureSelection from "../featureSelection/featureSelection";
import BufferAnalysis from "../bufferAnalysis/bufferAnalysis";


function AnalysisContainer(props){
    // const [layer, setLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [features, setFeatures] = useState([]);
    // const [chosenFeatures, setChosenFeatures] = useState([]);
    const [data, setData,layer, setLayer, chosenFeatures, setChosenFeatures,analysis, setAnalysis] = useData()
    const theme = useTheme();
    const [show, setShow] = useState(props.display);
    
    
    useEffect(() => {
        setShow(props.display);
    }, [props.display]);

    function closeWindow(){
        clearInput();
        props.displayAnalysisWindow("close");
    }

    function createNewLayer(){
        console.log("Create new layer");
        console.log(layer)
        let baseLayer = data.find((l) => l.id === layer.value);
        console.log(baseLayer);
        let newFeatures = [];
        console.log(chosenFeatures);
        baseLayer.data.features.map(feature => {
            if(_.includes(chosenFeatures,feature.properties.OBJTYPE)){
                newFeatures.push(feature);
            }
        })
        let newData = {type:"FeatureCollection", features:newFeatures};
        let newLayer = {id:uuid(), name:baseLayer.name+"-feature-selecion", colour:"", data:newData, value:true};
        console.log(newLayer);
        setData(newLayer);
        closeWindow();

    }


    function clearInput(){
        setChosenFeatures([]);
        setLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
        setFeatures([]);
        setAnalysis("none");
    }


    return(
        <AnalysisBackground style={{display: show}}>
            <AnalysisC >
                <Headings>
                    <h1>{props.name}</h1>
                </Headings>
                <ButtonIcon
                    onClick={() => closeWindow()}
                    style={{position: "fixed",right:"0", top: "0", margin: "10px"}}
                >
                    <CloseIcon style={{fontSize: "40px"}}/>
                </ButtonIcon>

                {/* <FeatureSelection /> */}
                {/* <BufferAnalysis /> */}
                {props.analysis}
                
                {/* <ButtonIcon
                    onClick={()=> createNewLayer()}
                    style={{position: "fixed",right:"0", bottom: "0", margin: "10px"}}
                >
                    <NoteAddIcon style={{width: "50px", color: "black", fontSize: "40px"}}/>
                </ButtonIcon> */}
            </AnalysisC>
        </AnalysisBackground>

    );
}

export default AnalysisContainer;