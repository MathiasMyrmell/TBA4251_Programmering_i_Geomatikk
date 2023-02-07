import React from 'react';
import { useState, useEffect } from 'react';
import { useData } from "../../../../../contexts/DataContext";

import { Box, Chip, InputLabel, Select, MenuItem, OutlinedInput} from "@mui/material";
import { v4 as uuid } from "uuid";
import { useTheme } from '@mui/material/styles';
import _ from "lodash";
import { DropDownMenu , ButtonIcon, DropDownFieldError, DropDownField, DropDownItem, DDChip, DropDownFeatureSelect} from "../../../../muiElements/styles";
import NoteAddIcon from '@mui/icons-material/NoteAdd';



function FeatureSelection(props){
    const [features, setFeatures] = useState([]);
    const [chosenFeatures, setChosenFeatures] = useState([]);
    const [featureErrorMessage, setFeatureErrorMessage] = useState("");
    const [layerErrorMessage, setLayerErrorMessage] = useState("");
    const [data, setData, layer, setLayer, analysis, setAnalysis] = useData()
    const theme = useTheme();

    useEffect(() => {

    }, [chosenFeatures])



    // //Functions for execute button
    // Clear input fields
    function clearInput(){
        setChosenFeatures([]);
        setLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
        setFeatures([]);
        setAnalysis("none");
    }

    // Close Analysis window
    function closeWindow(){
        clearInput();
        setFeatureErrorMessage("");
        props.displayAnalysisWindow("close");
    }

    // //Functions for feature selection analysis
    //Chose layer for feature selection
    function choseLayer(target){
        setLayer(target);
        let layerData = data.find((layer) => layer.id === target.value).data.features;
        filterFeatures(layerData);
    }

    //Filter features
    function filterFeatures(data){
        setFeatures([]);
        let newFeatures = [];
        newFeatures.push(data[0].properties.OBJTYPE)
        compareLoop: for( let i = 0; i < data.length; i++){
            let newFeature = data[i].properties.OBJTYPE;
            for(let j = 0; j <newFeatures.length; j++){
                if(newFeatures[j] === newFeature){
                continue compareLoop
                }
            }
            newFeatures.push(newFeature);
        }
        for(let i = 0; i < newFeatures.length; i++){
            setFeatures(features => [...features, newFeatures[i]]);
        }
    }

    //Set chosen features
    const chooseFeatures = (event) => {
        const {
            target: { value },
        } = event;
        setChosenFeatures(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    // Create new layer
    function createNewLayer(){
        let validFeatures = checkValidFeatures();
        let validLayer = checkValidLayer();
        if(validFeatures !== true || validLayer !== true){
            return;
        }
    
        console.log("Create new layer");
        console.log(layer)
        let baseLayer = data.find((l) => l.id === layer.value);
        console.log(baseLayer);
        let newFeatures = [];
        console.log(chosenFeatures);
        baseLayer.data.features.map(feature => {
            if(_.includes(chosenFeatures,feature.properties.OBJTYPE)){
                newFeatures.push(feature);
            }
        })
        let newData = {type:"FeatureCollection", features:newFeatures};
        let newLayer = {id:uuid(), name:baseLayer.name+"-feature-selecion", colour:"", data:newData, value:true};
        console.log(newLayer);
        setData(newLayer);
        closeWindow();
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

    function checkValidFeatures(){
        if(chosenFeatures.length === 0){
            setFeatureErrorMessage("At least one feature must be selected");
            return false;
        }else{
            setFeatureErrorMessage("");
            return true;
        }
    }


    return (
        <>
            <DropDownMenu >
                <InputLabel id="demo-simple-select-label" >Layer</InputLabel>
                <DropDownField
                    labelId="demo-simple-select-label"
                    id="select"
                    value={layer.value}
                    label="Layer"
                    
                    onChange={(e) => choseLayer(e.target)}
                >
                    {data.map((layer) => (
                    <DropDownItem
                        key={layer.id}
                        value={layer.id}
                    >
                        {layer.name}
                    </DropDownItem>
                    
                    ))}
                </DropDownField>
                <DropDownFieldError >{layerErrorMessage}</DropDownFieldError>
            </DropDownMenu>
            <DropDownMenu >
                <InputLabel id="demo-multiple-chip-label" >Features</InputLabel>
                <DropDownField
                labelId="demo-multiple-chip-label"
                id="featureSelect"
                multiple
                value={chosenFeatures}
                onChange={chooseFeatures}
                label="Features"

                renderValue={(selected) => (
                    <DropDownFeatureSelect > 
                    {selected.map((value) => (
                        <Chip key={value} label={value} />
                    ))}
                    </DropDownFeatureSelect>
                )}
                >
                {features.map((feature) => (
                    <DropDownItem
                    key={uuid()}
                    value={feature}
                    >
                    {feature}
                    </DropDownItem>
                ))}
                </DropDownField>
                <DropDownFieldError >{featureErrorMessage}</DropDownFieldError>
            </DropDownMenu>
        

            <ButtonIcon
                onClick={()=> createNewLayer()}
                style={{position: "fixed",right:"0", bottom: "0", margin: "10px"}}
            >
                <NoteAddIcon style={{fontSize: "40px"}}/>
            </ButtonIcon>

        </>
    );


    
}

export default FeatureSelection;