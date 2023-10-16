import { React, useState, useEffect } from 'react';
//Components

import UAnalysis from "./unionAnalysis.jsx";

//Contexts
import { useData } from "../../../../../contexts/DataContext.jsx";
import { useAnalysis } from "../../../../../contexts/AnalysisContext.jsx";

//Styles
import { Box, Chip, InputLabel, Select, MenuItem, OutlinedInput} from "@mui/material";
import { DropDownMenu , ButtonIcon, DropDownFieldError, DropDownField, DropDownItem, DDChip, DropDownFeatureSelect} from "../../../../muiElements/styles.jsx";
import NoteAddIcon from '@mui/icons-material/NoteAdd';

//Div
import { v4 as uuid } from "uuid";
import _ from "lodash"; 
import * as turf from '@turf/turf';




function UnionAnalysis(){
    const [firstLayer, setFirstLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [secondLayer, setSecondLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [data, setData] = useData() 
    const [analysis, displayAnalysis,showAnalysis, setShowAnalysis, analyses, prepareLayersForAnalysis, addAreaToFeature] = useAnalysis();
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


    // //Functions for execute button
    // Clear input fields
    function clearInput(){
        setFirstLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
        setSecondLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
        setLayerErrorMessage("");
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

    function executeUnionAnalysis(){

        //Check if chosen layers are valid
        let validLayer = _checkValidLayer();
        if(validLayer !== true){
            return;
        }

        // Prepare layers for analysis
        let layers = prepareLayersForAnalysis(firstLayer, secondLayer)
        let names = [layers[0].name, layers[1].name]
        let data = [layers[0].data, layers[1].data]
  
        const analysis = new UAnalysis(data);
        console.log("analysis", analysis)

        // Add area to features
        let layerData = turf.featureCollection([])
        for(let i = 0; i < analysis.result.features.length; i++){
            layerData.features.push(addAreaToFeature(analysis.result.features[i]));
        }

        // FINAL REPRESENTATION
        // Add new layer to data
        let name = "Union_"+names[0].name + "_" + names[1].name
        let newLayer = {id : uuid(), name: name, colour: "", data: layerData, value: true}
        console.log("newLayer", newLayer)
        
        // Add new layer to data
        setData(newLayer)
        clearInput();
        setShowAnalysis("none");

        // // Find union between layers
        // console.log("Starting union")
        // let union = _union([fLdissolved, sLdissolved]);

        // console.log("union", union)
        // let dissolved = turf.dissolve(union);
        // console.log("dissolved", dissolved)

        // // Calculate area of dissolved buffers
        // let layerData = turf.featureCollection([])
        // for(let i = 0; i < dissolved.features.length; i++){
        //     layerData.features.push(_addAreaToFeature(dissolved.features[i]));
        // }

        // console.log("layerData", layerData)
        // // Create new layer with union data
        // let newLayer = {id: uuid(), name: "Union of " + fL.name + " and " + sL.name, colour: "", data: layerData, value:true};

        // console.log("newLayer", newLayer)

        // // Display new layer on map
        // setData(newLayer)

        //Clear input
        clearInput();
        setShowAnalysis("none")


    }

    function _splitMultiPolygons(layer){
        let data = layer.data;
        let fC = turf.featureCollection([])
        for(let i = 0; i < data.features.length; i++){
            let feature = data.features[i];
            
            //If feature is polygon, add to feature collection
            if(feature.geometry.type === "Polygon"){
                fC.features.push(feature)
                continue
            }
            for(let j = 0; j < feature.geometry.coordinates.length; j++){
                let polygon = turf.polygon(feature.geometry.coordinates[j])
                polygon.properties = {Shape_Area:0}
                polygon.properties.Shape_Area = turf.area(polygon);
                fC.features.push(polygon)
            }
        }
        layer.data = fC
        return layer

    }

    function _union(layers){
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

        // Find union between layers
        let union = []
        for(let i = 0; i<layers[0].length; i++){
            for(let j = 0; j<layers[1].length; j++){
                let unionPolygon = turf.union(layers[0][i], layers[1][j])
                if(unionPolygon.geometry.type === "Polygon"){
                    console.log("unionPolygon1", unionPolygon)
                    union.push(unionPolygon)
                }
                else{
                    for(let k = 0; k<unionPolygon.geometry.coordinates.length; k++){
                        console.log("unionPolygon2", unionPolygon.geometry.coordinates[k])
                        union.push(turf.polygon(unionPolygon.geometry.coordinates[k]))
                    }
                }
            }
        }
        let fC = turf.featureCollection(union)
        console.log("fC", fC)
        return fC
    }

    function _addAreaToFeature(feature){
        feature.properties = {Shape_Area:0}
        let area = turf.area(feature);
        feature.properties.Shape_Area = area;
        return feature;
    }




    function dissolve(layer){
        console.log("layer", layer)
        let fC = turf.featureCollection([])
        fC.features.push(layer.features.pop())
        fC.features.push(layer.features.pop())
        fC = turf.dissolve(fC);
        for(let i = 0; i < layer.features.length; i++){
            console.log("i", i)
            fC.features.push(layer.features[i])
            fC = turf.dissolve(fC);
        }

        console.log("fC", fC)
        console.log("layer", layer)
        




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
                onClick={()=> executeUnionAnalysis()}
                style={{position: "fixed",right:"0", bottom: "0", margin: "10px"}}
            >
                <NoteAddIcon style={{fontSize: "40px"}}/>
            </ButtonIcon>
        </>
    );
}

export default UnionAnalysis;