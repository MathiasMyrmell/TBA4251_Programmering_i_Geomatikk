import { React, useState, useEffect } from 'react';
//Components


//Contexts
import { useData } from "../../../../../contexts/DataContext.jsx";
import { useAnalysis } from "../../../../../contexts/AnalysisContext.jsx";

//Styles
import { Box, Chip, InputLabel, Select, MenuItem, OutlinedInput, TextField, Card} from "@mui/material";
import {  ButtonIcon } from "../../../../muiElements/styles.jsx";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckIcon from '@mui/icons-material/Check';

//Div
import { v4 as uuid } from "uuid";
import _ from "lodash"; 
import * as turf from '@turf/turf';


function CreateLayer(){
    const [data, setData, layer, setLayer, clearData, updateData, showContainer, setShowContainer,backgroundContent, setBackgroundContent, hideContentElements, setHideContentElements] = useData() 
    const [analysis, displayAnalysis,showAnalysis, setShowAnalysis, analyses, prepareLayersForAnalysis, addAreaToFeature, showAnalysisMenu, setShowAnalysisMenu, showCreateLayerMode, setShowCreateLayerMode] = useAnalysis();
    
    function startCreateLayer(){
        setShowAnalysis("none");
        setShowCreateLayerMode(true);
    }   


    return (
        <>
            <Card>
                hello
            </Card>
            <ButtonIcon
                onClick={()=> startCreateLayer()}
                style={{position: "fixed",right:"0", bottom: "0", margin: "10px"}}
            >
                <CheckIcon style={{fontSize: "40px"}}/>
            </ButtonIcon>
        </> 
    )
}

export default CreateLayer