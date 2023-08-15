import React from "react";
import { useState } from 'react';
import { useData } from "../../../../../contexts/DataContext";

 
import { InputLabel, MenuItem} from "@mui/material";
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
    //Buffer Analysis new
    function bufferAnalysis(){
        let validBuffer= checkValidBufferDistance();
        let validLayer = checkValidLayer();
        if(validBuffer !== true || validLayer !== true){
            return;
        }


        //Get data from layer with given id
        let baseLayer = data.find((l) => l.id === layer.value);
        console.log("---------"+baseLayer.name+"-----------")
        console.log("baseLayer", baseLayer)

        let collection = turf.featureCollection(baseLayer.data.features);
        let buffer = turf.buffer(collection, bufferDistance, {units: 'meters'});

        console.log("buffer", buffer)

        // //Dissolve buffers
        // split multi polygons into single polygons
        // let splitted = {"type": buffer.type, "features": []}
        let splitted = [];
        for(var i = 0; i<buffer.features.length; i++){
            let feature = buffer.features[i]
            if(feature.geometry.type === "MultiPolygon"){
                for(var j = 0; j<feature.geometry.coordinates.length; j++){
                    // splitted.features.push({"type":feature.type, "properties":feature.properties, "geometry":{"type":"Polygon", "coordinates":feature.geometry.coordinates[j]}})
                    splitted.push({"type":feature.type, "properties":feature.properties, "geometry":{"type":"Polygon", "coordinates":feature.geometry.coordinates[j]}})
                }
            }
            else{
                // splitted.features.push(feature)
                splitted.push(feature)
            }
        }


        let batchSize = null;
        let batchSizes = [32, 16, 8, 4, 2, 1];
        for(var i = 0; i<batchSizes.length; i++){
            if(splitted.length%batchSizes[i] !=0){
                batchSize = batchSizes[i];
                break;
            }
        }

        let batches = [];
        let numInBatch = Math.ceil(splitted.length/batchSize);
        for(var i=0; i<splitted.length; i+=numInBatch){
            let batch = splitted.slice(i, i+numInBatch);

            let featureCollection = turf.featureCollection(batch);
            batches.push(featureCollection);
        }
        console.log("batches", batches)
        console.log("num batches", batches.length)

        let dissolved = dissolveBatches(batches);
        console.log("dissolved", dissolved)



        // Create new layer
        let newLayer = {id:uuid(), name:baseLayer.name+"-buffer-"+bufferDistance+"m", colour:"", data:dissolved, value:true};
        console.log("newLayer", newLayer)
        //Add new layer to data
        setData(newLayer);
        console.log("new layer added to map")
        //Clear input
        clearInput();
        closeWindow();

    }


    function dissolveBatches(batches){
        let j = 1;
        while (batches.length > 1){
            let newBatches = [];
            console.log("j", j)
            for(var i = 0; i<batches.length; i+=2){
                let batch1 = batches[i];
                let batch2 = batches[i+1];
                let fc1 = batch1.features;
                let fc2 = batch2.features;

                let dissolved = turf.dissolve(turf.featureCollection(fc1.concat(fc2)));
                newBatches.push(dissolved);
            }
            j++;
            batches = newBatches;
        }   
        return batches[0];
    }


    //Buffer Analysis old
    function bufferAnalysis2(){
        let validBuffer= checkValidBufferDistance();
        let validLayer = checkValidLayer();
        if(validBuffer !== true || validLayer !== true){
            return;
        }


        //Get data from layer with given id
        let baseLayer = data.find((l) => l.id === layer.value);
        console.log("baseLayer", baseLayer)

        // //Merge layer features if there are more than one
        let dissolve = mergeLayerFeatures(baseLayer.data);
        console.log("dissolve", dissolve)

        //Get buffer area with given distance
        let buffer = turf.buffer(dissolve, bufferDistance, {units: 'meters'});

        //Merge buffers if intersecting
        let mergedBuffers = mergeLayerFeatures(buffer);
        
        //Create new layer
        let newLayer = {id:uuid(), name:baseLayer.name+"-buffer-"+bufferDistance+"m", colour:"", data:mergedBuffers, value:true};
        
        //Add new layer to data
        setData(newLayer);

        //Clear input
        // clearInput();
        closeWindow();
    }

    // Merge layers that intersect
    function mergeLayerFeatures(layer){
        //Create one layer
        console.log("layer")
        console.log(layer)

        // split multi polygons into single polygons
        let splitted = {"type": layer.type, "features": []}
        for(var i = 0; i<layer.features.length; i++){
            let feature = layer.features[i]
            if(feature.geometry.type === "MultiPolygon"){
                for(var j = 0; j<feature.geometry.coordinates.length; j++){
                    splitted.features.push({"type":feature.type, "properties":feature.properties, "geometry":{"type":"Polygon", "coordinates":feature.geometry.coordinates[j]}})
                }
            }
            else{
                splitted.features.push(feature)
            }
        }
        console.log("splitted", splitted)

        var dissolve = turf.dissolve(splitted);
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