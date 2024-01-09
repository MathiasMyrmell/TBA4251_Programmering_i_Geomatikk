import { React, useState, useEffect } from 'react';
//Components
import DiffAnalysis from "./differenceAnalysis";

//Contexts 
import { useData } from "../../../../../contexts/DataContext.jsx";

//Styles
import { InputLabel, MenuItem } from "@mui/material";
import { DropDownMenu , ButtonIcon, DropDownFieldError, DropDownField } from "../../../../muiElements/styles.jsx";
import NoteAddIcon from '@mui/icons-material/NoteAdd';


//Div
import * as turf from '@turf/turf';
import { v4 as uuid } from "uuid";
import _ from "lodash";


function DifferenceAnalysis(){
    const [data, setData, removeData, analysis, prepareLayersForAnalysis, displayAnalysis,showAnalysis, setShowAnalysis] = useData()
    const [firstLayer, setFirstLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [secondLayer, setSecondLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [layerErrorMessage, setLayerErrorMessage] = useState("");

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

        // Prepare layers for analysis
        let layers = prepareLayersForAnalysis(firstLayer, secondLayer)
        let names = [layers[0].name, layers[1].name]
        let data = [layers[0].data, layers[1].data]
 
        const analysis = new DiffAnalysis(data);

        // Add area to features
        let layerData = turf.featureCollection([])
        for(let i = 0; i < analysis.result.features.length; i++){
            layerData.features.push(analysis.result.features[i]);
        }

        // Add new layer to data
        let name = "Difference_"+names[0] + "_" + names[1]
        let newLayer = {id : uuid(), name: name, colour: "", data: layerData, value: true}
        
        // Add new layer to data
        setData(newLayer)
        clearInput();
        setShowAnalysis("none");
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