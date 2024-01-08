import { React, useState, useEffect } from 'react';
//Components
import UAnalysis from "./unionAnalysis";

//Contexts
import { useData } from "../../../../../contexts/DataContext";

//Styles
import { InputLabel, MenuItem } from "@mui/material";
import { DropDownMenu , ButtonIcon, DropDownFieldError, DropDownField } from "../../../../muiElements/styles";
import NoteAddIcon from '@mui/icons-material/NoteAdd';

//Div
import * as turf from '@turf/turf';
import { v4 as uuid } from "uuid";
import _ from "lodash"; 

function UnionAnalysis(){
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
            layerData.features.push(analysis.result.features[i]);
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