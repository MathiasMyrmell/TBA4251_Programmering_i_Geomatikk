import { React, useState, useEffect } from 'react';
//Components
import IntersectionAnalysis from "./intersectionAnalysis";

//Contexts
import { useData } from "../../../../../contexts/DataContext";

//Styles
import { InputLabel, MenuItem } from "@mui/material";
import { DropDownMenu , ButtonIcon, DropDownFieldError, DropDownField } from "../../../../muiElements/styles";
import NoteAddIcon from '@mui/icons-material/NoteAdd';

//Div
import * as turf from '@turf/turf';
import { v4 as uuid } from "uuid";
 



function IntersectAnalysis(){
    const [data, setData, removeData, analysis, prepareLayersForAnalysis, displayAnalysis,showAnalysis, setShowAnalysis] = useData()
    const [firstLayer, setFirstLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [secondLayer, setSecondLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
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

    // Perform intersection between two layers
    function executeIntersectAnalysis(){

        //Check if chosen layers are valid
        let validLayer = _checkValidLayer();
        if(validLayer !== true){
            return;
        }
 
        // Prepare layers for analysis
        let layers = prepareLayersForAnalysis(firstLayer, secondLayer)
        let names = [layers[0].name, layers[1].name]
        let data = [layers[0].data, layers[1].data]

        //Perform analysis
        const analysis = new IntersectionAnalysis(data)

        // Create feature collection
        let layerData = turf.featureCollection([])
        for(let i = 0; i < analysis.result.features.length; i++){
            layerData.features.push(analysis.result.features[i]);
        }
        //Create new layer
        let name = "Intersection_"+names[0] + "_" + names[1]
        let newlayer = {id:uuid(), name:name, colour:"", data:layerData, value:true}

        //Add new layer to data
        setData(newlayer)
        clearInput();
        setShowAnalysis("none");
    }


    function addPropertiesToLayer(layer){
        console.log("addPropertiesToLayer: layer", layer)
        let oldLayerData = layer.data
        console.log("oldLayerData", oldLayerData)
        let newLayerData = turf.featureCollection([])
        console.log("newLayerData", newLayerData)
        for(let i = 0; i < oldLayerData.features.length; i++){
          let feature = oldLayerData.features[i]
          let area = turf.area(feature);
          let type = feature.properties.Type
          if(feature.properties === undefined){
            type = "Area"
          }
          feature.properties["Shape_Area"] = area
          feature.properties["Type"] = type
          newLayerData.features.push(feature)
        }
    
        console.log("newLayerData", newLayerData)
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