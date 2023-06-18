import React from 'react';
import { useState, useEffect } from 'react';
import { useData } from "../../../../../contexts/DataContext";

import * as turf from '@turf/turf';

import { Box, Chip, InputLabel, Select, MenuItem, OutlinedInput} from "@mui/material";
import { v4 as uuid } from "uuid";
import _ from "lodash";
import { DropDownMenu , ButtonIcon, DropDownFieldError, DropDownField, DropDownItem, DDChip, DropDownFeatureSelect} from "../../../../muiElements/styles";
import NoteAddIcon from '@mui/icons-material/NoteAdd';



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

    // Perform intersection between two layers
    function executeIntersectAnalysis(){

        //Check if chosen layers are valid
        let validLayer = _checkValidLayer();
        if(validLayer !== true){
            return;
        }
        intersectionAnalysis();
        
    }

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

    function intersectionAnalysis(){
        //Get layers for analysis
        let fL = data.find((layer) => layer.id === firstLayer.value);
        let sL = data.find((layer) => layer.id === secondLayer.value);

        // Dissolve layer data
        let fLdissolved = turf.dissolve(fL.data);
        let sLdissolved = turf.dissolve(sL.data);

        // Find intersection between layers
        let layerData = _intersection([fLdissolved, sLdissolved]);

        // Create new layer with intersection data
        let layerName = "Intersection_"+fL.name + "_" + sL.name;
        let newLayer = {id:uuid(), name:layerName, colour:"", data:layerData, value:true};

        // Display new layer on map
        setData(newLayer)
    }

    function _intersection(layers){
        let fL = layers[0]
        let sL = layers[1]
        // Extract polygons in layers
        for(let i = 0; i<layers.length; i++){
            if(layers[i].features.length == 1){
                layers[i] = [layers[i].features[0].geometry]
            }
            else{
                let polygons = []
                for(let j = 0; j<layers[i].features.length; j++){
                    polygons.push(layers[i].features[j].geometry)
                }
                layers[i] = polygons
            }
        }

        // Find intersection between layers
        let intersections = []
        for(let i = 0; i<layers[0].length; i++){
            for(let j = 0; j<layers[1].length; j++){
                let intersection = turf.intersect(layers[0][i], layers[1][j])
                if(intersection != null){
                    intersections.push(intersection)
                }
            }
        }

        // Create FeatureCollection
        let nFeatures = [];
        for(let j = 0; j<intersections.length; j++){
            nFeatures.push({type:"Feature", geometry: intersections[j].geometry});
        }
        let featureCollection = {type:"FeatureCollection", features:nFeatures};

        return featureCollection





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