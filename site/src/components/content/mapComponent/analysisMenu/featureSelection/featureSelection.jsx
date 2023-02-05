import React from 'react';
import { useState, useEffect } from 'react';
import { useData } from "../../../../../contexts/DataContext";

import { Box, Chip, InputLabel, Select, MenuItem, OutlinedInput, FormHelperText} from "@mui/material";
import { v4 as uuid } from "uuid";
import { useTheme } from '@mui/material/styles';
import _ from "lodash";
import { DropDownMenu , ButtonIcon} from "../../../../muiElements/styles";
import NoteAddIcon from '@mui/icons-material/NoteAdd';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


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
                <Select
                    labelId="demo-simple-select-label"
                    id="select"
                    value={layer.value}
                    label="Layer"
                    
                    onChange={(e) => choseLayer(e.target)}
                >
                    {data.map((layer) => (
                    <MenuItem
                        key={layer.id}
                        value={layer.id}
                    >
                        {layer.name}
                    </MenuItem>
                    
                    ))}
                </Select>
                <FormHelperText style={{color:"red"}}>{layerErrorMessage}</FormHelperText>
            </DropDownMenu>
            <DropDownMenu >
                <InputLabel id="demo-multiple-chip-label" >Features</InputLabel>
                <Select
                labelId="demo-multiple-chip-label"
                id="featureSelect"
                multiple
                value={chosenFeatures}
                onChange={chooseFeatures}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                label="Features"
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                        <Chip key={value} label={value} />
                    ))}
                    </Box>
                )}
                MenuProps={MenuProps}
                >
                {features.map((feature) => (
                    <MenuItem
                    key={uuid()}
                    value={feature}
                    style={getStyles(feature, chosenFeatures, theme)}
                    >
                    {feature}
                    </MenuItem>
                ))}
                </Select>
                <FormHelperText style={{color: "red" }}>{featureErrorMessage}</FormHelperText>
            </DropDownMenu>
        

            <ButtonIcon
                    onClick={()=> createNewLayer()}
                    style={{position: "fixed",right:"0", bottom: "0", margin: "10px"}}
                >
                    <NoteAddIcon style={{width: "50px", color: "black", fontSize: "40px"}}/>
                </ButtonIcon>

        </>
    );


    
}

export default FeatureSelection;