import React from "react";
import { useState } from 'react';
import { useData } from "../../../../../contexts/DataContext";


import { InputLabel, Select, MenuItem, FormHelperText} from "@mui/material";
import { v4 as uuid } from "uuid";
import * as turf from '@turf/turf';
import { ButtonIcon, DropDownMenu, InputField, DropDownFieldError, DropDownField} from "../../../../muiElements/styles";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
 

function BufferAnalysis(props){
    const [layer, setLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [bufferDistance, setBufferDistance] = useState("");
    const [bufferDistanceErrorMessage, setbufferDistanceErrorMessage] = useState(" ");
    const [layerErrorMessage, setLayerErrorMessage] = useState("");
    const [data, setData] = useData()

    // //Functions for execute button
    // Clear input fields
    function clearInput(){
        setBufferDistance("");
        setLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
    }

    // Close Analysis window
    function closeWindow(){
        clearInput();
        props.displayAnalysisWindow("close");
    }


    // //Functions for buffer analysis
    //Chose layer for feature selection
    function choseLayer(target){
        setLayer(target);
    }
    //Buffer Analysis
    function bufferAnalysis(){
        let validBuffer= checkValidBufferDistance();
        let validLayer = checkValidLayer();
        if(validBuffer !== true || validLayer !== true){
            return;
        }

        //Get data from layer with given id
        let baseLayer = data.find((l) => l.id === layer.value);

        //Merge layer features if there are more than one
        let dissolve = mergeLayerFeatures(baseLayer.data);

        //Get buffer area with given distance
        let buffer = turf.buffer(dissolve, bufferDistance, {units: 'meters'});

        //Merge buffers if intersecting
        let mergedBuffers = mergeLayerFeatures(buffer);
        
        //Create new layer
        let newLayer = {id:uuid(), name:baseLayer.name+"-buffer-"+bufferDistance+"m", colour:"", data:mergedBuffers, value:true};
        
        //Add new layer to data
        setData(newLayer);

        //Clear input
        clearInput();
        closeWindow();
    }

    // Merge layers that intersect
    function mergeLayerFeatures(layer){
        //Create one layer
        console.log("layer")
        console.log(layer)
        var dissolve = turf.dissolve(layer);
        console.log("dissolve");
        console.log(dissolve);
        let features = [];
        if(dissolve.features.length==1){
            console.log("if")
            features = dissolve.features[0].geometry.coordinates;
        }else{
            console.log("else")
            let buffers = dissolve.features;
            for(let i=0;i<buffers.length;i++){
                features.push(buffers[i].geometry.coordinates[0]);
            }
        }

        let newGeometry = [];

        for(let i=0;i<features.length;i++){
            // console.log(features[i])
            if(features[i].length >= 4 || features[i].length == 0){
                for(let k=0;k<features[i].length;k++){
                    features[i][k].push(0);
                }
                newGeometry.push(features[i]);
            }
        }

        let nF = [];
        for(let j = 0; j<newGeometry.length; j++){
            nF.push({type:"Feature", geometry: {type:"Polygon", coordinates:[newGeometry[j]]}});
        }

        let newData = {type:"FeatureCollection", features:nF};
        return newData;
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