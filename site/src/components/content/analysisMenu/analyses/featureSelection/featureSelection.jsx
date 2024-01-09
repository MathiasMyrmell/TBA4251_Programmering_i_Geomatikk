import { React, useState, useEffect } from 'react';

//Contexts
import { useData } from "../../../../../contexts/DataContext";

//Styles
import { Chip, InputLabel } from "@mui/material";
import { DropDownMenu , ButtonIcon, DropDownFieldError, DropDownField, DropDownItem, DropDownFeatureSelect} from "../../../../muiElements/styles";
import NoteAddIcon from '@mui/icons-material/NoteAdd';

//Div
import { v4 as uuid } from "uuid";
import _ from "lodash";
import * as turf from '@turf/turf';

function FeatureSelection(){
    const [features, setFeatures] = useState([]);
    const [chosenFeatures, setChosenFeatures] = useState([]);
    const [featureErrorMessage, setFeatureErrorMessage] = useState("");
    const [layerErrorMessage, setLayerErrorMessage] = useState("");
    const [layer, setLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [data, setData, removeData, analysis, prepareLayersForAnalysis, displayAnalysis,showAnalysis, setShowAnalysis] = useData()

    useEffect(() => {

    }, [chosenFeatures])

    // //Functions for execute button
    // Clear input fields
    function clearInput(){
        setChosenFeatures([]);
        setLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
        setFeatures([]);
        
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
        newFeatures.push(data[0].properties.Type)
        compareLoop: for( let i = 0; i < data.length; i++){
            let newFeature = data[i].properties.Type;
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
    
        let baseLayer = data.find((l) => l.id === layer.value);
        let newFeatures = [];
        baseLayer.data.features.map(feature => {
            if(_.includes(chosenFeatures,feature.properties.Type)){
                newFeatures.push(feature);
            }
        })
        let newData = turf.featureCollection(newFeatures);
        let newLayer = {id:uuid(), name:baseLayer.name+"-feature-selecion", colour:"", data:newData, value:true};
        
        setData(newLayer);
        clearInput();
        setShowAnalysis("none");
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