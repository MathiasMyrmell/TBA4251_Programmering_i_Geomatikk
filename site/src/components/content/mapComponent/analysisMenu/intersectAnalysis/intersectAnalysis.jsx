import React from 'react';
import { useState, useEffect } from 'react';
import { useData } from "../../../../../contexts/DataContext";

import * as turf from '@turf/turf';

import { InputLabel, MenuItem} from "@mui/material";
import { v4 as uuid } from "uuid";
// import _ from "lodash";
import { DropDownMenu , ButtonIcon, DropDownFieldError, DropDownField} from "../../../../muiElements/styles";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { divide, max, min, set } from 'lodash';

import TreeStructure from "./treeStructure";
import IntersectionAnalysis from './intersectionAnalysis';

 

function IntersectAnalysis(props){
    const [firstLayer, setFirstLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [secondLayer, setSecondLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [data, setData] = useData()
    const [layerErrorMessage, setLayerErrorMessage] = useState("");

    function choseFirstLayer(target){
        setFirstLayer(target);
    }

    function choseSecondLayer(target){
        setSecondLayer(target);
    }

    useEffect(() => {
        if(firstLayer.value === secondLayer.value && firstLayer.value !== "" && secondLayer.value !== ""){
            setLayerErrorMessage("Layers cannot be the same");
        }else{
            setLayerErrorMessage("");
        }

    }, [firstLayer,secondLayer])

    ///Functions for execute button
    // Clear input fields
    function clearInput(){
        setFirstLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
        setSecondLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
        setLayerErrorMessage("");
    }

    // Close Analysis window
    function closeWindow(){
        clearInput();
        props.displayAnalysisWindow("close");
    }

    // Perform intersection between two layers
    function executeIntersectAnalysis(){

        //Check if chosen layers are valid
        let validLayer = _checkValidLayer();
        if(validLayer !== true){
            return;
        }

        // Execute analysys
        // Get layers
        let fL = data.find((layer) => layer.id === firstLayer.value);
        let sL = data.find((layer) => layer.id === secondLayer.value);


        // Dissolve layers
        let fLD = _dissolveLayer(fL.data)
        let sLD = _dissolveLayer(sL.data)
        let layers = [fLD, sLD]

        //Perform analysis
        const analysis = new IntersectionAnalysis(layers)
        analysis.performIntersection()

        //Create new layer
        let newlayer = {id:uuid(), name:"Intersection_"+fL.name+"_"+sL.name, colour:"", data:analysis.result, value:true}
        console.log("newLayer",newlayer)

        //Add new layer to data
        setData(newlayer)

        closeWindow();
    }

    // Check if input layers are valid
    function _checkValidLayer(){
        if(firstLayer.id === "none" || secondLayer.id === "none"){
            setLayerErrorMessage("Both layers must be selected");
            return false;
        }else if(firstLayer.value === secondLayer.value){
            setLayerErrorMessage("Layers cannot be the same");
            return false;
        }else{
            setLayerErrorMessage("");
            return true;
        }
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


    return (
        <>
            <DropDownMenu >
                <InputLabel id="demo-simple-select-label">Layer</InputLabel>
                <DropDownField
                    labelId="demo-simple-select-label"
                    id="select"
                    value={firstLayer.value}
                    label="Layer"
                    onChange={(e) => choseFirstLayer(e.target)}
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
            </DropDownMenu>
            <DropDownMenu >
                <InputLabel id="demo-simple-select-label">Layer</InputLabel>
                <DropDownField
                    labelId="demo-simple-select-label"
                    id="select"
                    value={secondLayer.value}
                    label="Layer"
                    onChange={(e) => choseSecondLayer(e.target)}
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
            <ButtonIcon
                onClick={()=> executeIntersectAnalysis()}
                style={{position: "fixed",right:"0", bottom: "0", margin: "10px"}}
            >
                <NoteAddIcon style={{fontSize: "40px"}}/>
            </ButtonIcon>
        </>
    );
}

export default IntersectAnalysis;