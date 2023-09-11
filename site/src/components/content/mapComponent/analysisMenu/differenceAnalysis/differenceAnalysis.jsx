import React from 'react';
import { useState, useEffect } from 'react';
import { useData } from "../../../../../contexts/DataContext";

import * as turf from '@turf/turf';

import { Box, Chip, InputLabel, Select, MenuItem, OutlinedInput} from "@mui/material";
import { v4 as uuid } from "uuid";
import { useTheme } from '@mui/material/styles';
import _ from "lodash";
import { DropDownMenu , ButtonIcon, DropDownFieldError, DropDownField, DropDownItem, DDChip, DropDownFeatureSelect} from "../../../../muiElements/styles";
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import differenceAnalysis from "./differenceAnalysis.js";

function DifferenceAnalysis(props){
    const [firstLayer, setFirstLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [secondLayer, setSecondLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [layerErrorMessage, setLayerErrorMessage] = useState("");
    const [data, setData, layer, setLayer, analysis, setAnalysis] = useData()
    const theme = useTheme();

    function closeWindow(){
        clearInput();
        props.displayAnalysisWindow("close");
    }

    function clearInput(){
        setFirstLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
        setSecondLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
        setLayerErrorMessage("");
    }

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


    function executeDifferenceAnalysis(){
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
        console.log("layers", layers)
        let names = [fL.name, sL.name]
        // Display dissolved layers
        // for(let i = 0; i<layers.length; i++){
        //     let fC = layers[i]
        //     let layer = {id : uuid(), name: names[i]+" diss", colour: "", data: fC, value: true}
        //     setData(layer)
        // }


        let differences = differenceAnalysis(layers);
        console.log("Differences", differences)


        // ////FUNKER FOR VISUALISERING TIL RES AV DISSOLVELEAFNODES()
        // let newLayers = [[],[]]
        // let nodes = differences.leafNodes
        // // console.log("n", nodes)
        // for(let n = 0; n< nodes.length; n++){
        //     let node = nodes[n]
        //     // console.log(node)
        //     let nodeLayers = node.layers
        //     // console.log(nodeLayers)
        //     for(let l = 0; l<nodeLayers.length; l++){
        //         // console.log("l"+l, nodeLayers[l])
        //         for(let f = 0; f<nodeLayers[l].length; f++){
        //             // console.log("f"+f, nodeLayers[l][f])
        //             newLayers[l].push(nodeLayers[l][f])
        //         }
        //     }
        // }
        // for(let i = 0; i<newLayers.length; i++){
        //     let fC = turf.featureCollection(newLayers[i])
        //     let l = {id : uuid(), name: names[i]+" dLN", colour: "", data: fC, value: true}
        //     setData(l)
        // }

        ////FUNKER FOR VISUALISERING TIL RES AV PERFORMDIFFERENCE()
        //Final layer
        // let newLayer = []
        // let nodes = differences.leafNodes
        // for(let n = 0; n< nodes.length; n++){
        //     let node = nodes[n]
        //     let differenceLayers = node.differences
        //     // console.log("dL",differenceLayers)
        //     if(differenceLayers === null){
        //         continue
        //     }
        //     for(let f = 0; f<differenceLayers.length; f++){
        //         let feature = differenceLayers[f]
        //         // console.log("f", feature)
        //         newLayer.push(feature)
        //     }
        // }
        // let fC = turf.featureCollection(newLayer)
        // let l = {id : uuid(), name: "PERFORMDIFFERENCE", colour: "", data: fC, value: true}
        // setData(l)
        
        // // every bbox with data
        // let nodes = differences.leafNodes
        // for(let n = 0; n< nodes.length; n++){
        //     let node = nodes[n]

        //     //BBOX
        //     let bbox = {id : uuid(), name: "bbox"+n, colour: "", data: turf.featureCollection([node.bbox]), value: true}
        //     setData(bbox)    


        //     //Layers
        //     let layers = node.layers
        //     // console.log(layers)
        //     for(let l = 0; l<layers.length; l++){
        //         let layer = layers[l]
        //         // console.log(layer)
        //         let newLayer = turf.featureCollection([])
                
        //         for(let f = 0; f<layer.length; f++){
        //             let feature = layer[f]
        //             // console.log(feature)
        //             newLayer.features.push(feature)
        //         }
        //         // console.log(newLayer)
        //         if(newLayer.features.length>0){
        //             let fet = {id : uuid(), name: names[l]+l, colour: "", data: newLayer, value: false}
        //             setData(fet)
        //         }
        //     }



        //     if(node.differences === null){
        //         continue
        //     }
        //     //Differences            
        //     let diff = node.differences
        //     for(let d = 0; d<diff.length; d++){
        //         let lay = {id : uuid(), name: "diff"+d, colour: "", data: turf.featureCollection([diff[d]]), value: false}
        //         setData(lay)
        //     }
        // }


        // FINAL REPRESENTATION
        // Add new layer to data
        let name = "Difference_"+fL.name + "_" + sL.name
        let newLayer = {id : uuid(), name: name, colour: "", data: differences.difference, value: true}
        console.log("newLayer", newLayer)
        // Add new layer to data
        setData(newLayer)

        closeWindow();










        // let data1 = [[10,10], [10,20], [20,20], [20,10], [10,10]]
        // let data2 = [[25,25], [25,35], [35,35], [35,25], [25,25]]
        // let data3 = [[5,5], [5,25], [25,25], [25,5], [5,5]]
        // let poly1 = turf.polygon([data1])
        // let poly2 = turf.polygon([data2])
        // let poly3 = turf.polygon([data3])
        // let diff = turf.difference(poly1, poly2)
        // console.log("diff", diff)
        // console.log("===", poly1.geometry.coordinates === diff.geometry.coordinates)
        // console.log("turf.booleanEqual", turf.booleanEqual(poly1, diff))

        // let data1 = [[0,0], [0,5], [5,5], [5,0], [0,0]]
        // let data2 = [[5,0], [10,0], [10,5], [5,5], [5,0]]
        // let data3 = [[0,6], [5,6], [5,10], [0,10],[0,6]]

        // let poly1 = turf.polygon([data1])
        // let poly2 = turf.polygon([data2])
        // let poly3 = turf.polygon([data3])
        
        // let fC = turf.featureCollection([poly1, poly2, poly3])
        
        // let dissolve = turf.dissolve(fC)
        // console.log("DISSOLVE", dissolve)
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
                onClick={()=> executeDifferenceAnalysis()}
                style={{position: "fixed",right:"0", bottom: "0", margin: "10px"}}
            >
                <NoteAddIcon style={{fontSize: "40px"}}/>
            </ButtonIcon>
        </>  
    );


    
}

export default DifferenceAnalysis;