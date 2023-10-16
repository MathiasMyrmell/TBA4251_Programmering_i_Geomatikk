import React from "react";
import { useState } from 'react';
//Components


//Contexts
import { useData } from "../../../../../contexts/DataContext";
import { useAnalysis } from "../../../../../contexts/AnalysisContext";

//Styles
import { InputLabel, MenuItem} from "@mui/material";
import { ButtonIcon, DropDownMenu, InputField, DropDownFieldError, DropDownField} from "../../../../muiElements/styles";
import NoteAddIcon from '@mui/icons-material/NoteAdd';

//Div
import { v4 as uuid } from "uuid";
import * as turf from '@turf/turf';
 
 
function BufferAnalysis(){
    const [layer, setLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [bufferDistance, setBufferDistance] = useState("");
    const [bufferDistanceErrorMessage, setbufferDistanceErrorMessage] = useState(" ");
    const [layerErrorMessage, setLayerErrorMessage] = useState("");
    const [data, setData] = useData()

    const [analysis, displayAnalysis,showAnalysis, setShowAnalysis, analyses] = useAnalysis();

    // //Functions for execute button
    // Clear input fields
    function clearInput(){
        setBufferDistance("");
        setLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
    }


    // //Functions for buffer analysis
    //Chose layer for feature selection
    function choseLayer(target){
        setLayer(target);
    }

    //Buffer Analysis new
    function bufferAnalysis(){
        let validBuffer= checkValidBufferDistance();
        let validLayer = checkValidLayer();
        if(validBuffer !== true || validLayer !== true){
            return;
        }

        //Get data from layer with given id
        let baseLayer = data.find((l) => l.id === layer.value);

        // Create buffer around layer
        let buffer = turf.buffer(baseLayer.data, bufferDistance, {units: 'meters'});

        // Dissolve buffers
        let dissolved = turf.dissolve(buffer);

        // Calculate area of dissolved buffers
        let layerData = turf.featureCollection([])
        for(let i = 0; i < dissolved.features.length; i++){
            layerData.features.push(_addAreaToFeature(dissolved.features[i]));
        }

        //Create new layer
        let newLayer = {id:uuid(), name:baseLayer.name+"-buffer-"+bufferDistance+"m", colour:"", data:layerData, value:true};
        setData(newLayer);
        
        clearInput();
        setShowAnalysis("none");

    }

    function _addAreaToFeature(feature){
        feature.properties = {Shape_Area:0}
        let area = turf.area(feature);
        feature.properties.Shape_Area = area;
        return feature;
    }


    function checkValidLayer(){
        if(layer.id === "none"){
            setLayerErrorMessage("A layer must be selected");
            return false;
        }else{
            setLayerErrorMessage("");
            return true;
        }
    }

    function checkValidBufferDistance(){
        if(bufferDistance <=0){
            setbufferDistanceErrorMessage("At least one feature must be selected");
            return false;
        }else{
            setbufferDistanceErrorMessage(" ");
            return true;
        }
    }
    
    return(
        <>
            <DropDownMenu >
                <InputLabel id="demo-simple-select-label">Layer</InputLabel>
                <DropDownField
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
                </DropDownField>
                <DropDownFieldError >{layerErrorMessage}</DropDownFieldError>
            </DropDownMenu>

            <InputField 
                // id="outlined-basic"
                label="Buffer Distance (m)"
                variant="outlined"
                value={bufferDistance}
                helperText = {bufferDistanceErrorMessage}
                onChange = {(e) => setBufferDistance(e.target.value)}
            
            />
            <ButtonIcon
                onClick={()=> bufferAnalysis()}
                style={{position: "fixed",right:"0", bottom: "0", margin: "10px"}}
            >
                <NoteAddIcon style={{fontSize: "40px"}}/>
            </ButtonIcon>
        </>
    )
};

export default BufferAnalysis;