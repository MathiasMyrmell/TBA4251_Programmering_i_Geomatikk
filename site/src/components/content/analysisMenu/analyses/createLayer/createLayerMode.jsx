
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAnalysis } from "../../../../../contexts/AnalysisContext.jsx";
import { HomeButton, ButtonIcon } from "../../../../muiElements/styles.jsx";
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CloseIcon from '@mui/icons-material/Close';

// import { useData } from "../../../contexts/DataContext";

import { useData } from "../../../../../contexts/DataContext.jsx";
import { v4 as uuid } from "uuid";
import * as turf from '@turf/turf';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { set } from 'lodash';



function CreateLayerMode(){
    const [analysis, displayAnalysis,showAnalysis, setShowAnalysis, analyses, prepareLayersForAnalysis, addAreaToFeature, showAnalysisMenu, setShowAnalysisMenu, showCreateLayerMode, setShowCreateLayerMode] = useAnalysis();
    const [data, setData, layer, setLayer, clearData, updateData, showContainer, setShowContainer,backgroundContent, setBackgroundContent, hideContentElements, setHideContentElements, markers, setMarkers] = useData();

    const [show, setShow] = useState("block")
    const [alertMessageOpen, setAlertMessageOpen] = useState(false)

    useEffect (() => {
        if(showCreateLayerMode){
            setShow("block")
        }else{
            setShow("none")
        }
    }, [showCreateLayerMode])



    function displayElements(){
        setShowCreateLayerMode(false)
    }

    function createLayer(){
        if(markers.length < 3){
            setAlertMessage("To few markers to create layer. Minimum three markers needed.")
            setAlertType("error")
            setAlertMessageOpen(true)
            return;
        }
        //Create layer data
        let coordinates = []
        for(let i = 0; i < markers.length; i++){
            let lat = markers[i].position[1]
            let lng = markers[i].position[0]
            coordinates.push([lat, lng])
        }
        //Complete polygon by adding first marker to end
        coordinates.push([markers[0].position[1], markers[0].position[0]])
       
        //Create layer data
        let layerData = turf.featureCollection([turf.polygon([coordinates])])

        //Create layer from markers
        let newLayer = {id : uuid(), name: "New layer", colour: "", data: layerData, value: true}
        
        // Add new layer to data
        setData(newLayer)

        //Close create layer mode
        close()

        // Show success alert message
        setAlertMessage("Layer created successfully")
        setAlertType("success")
        setAlertMessageOpen(true)

    }

    function close(){
        setMarkers([])
        displayElements();
    }

    const closeAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setAlertMessageOpen(false);
    }
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });

    const [alertMessage, setAlertMessage] = useState("")
    const [alertType, setAlertType] = useState("success")
    
    return(
        <>
            <HomeButton 
                sx = {{
                    display: show,
                    right: "50px",
                    bottom: "0"
                }}
                onClick={createLayer}
            >
                <NoteAddIcon 
                    style={{fontSize: "50px"}}
                />
            </HomeButton>
            
            <HomeButton 
                sx = {{
                    display: show,
                    right: "120px",
                    bottom: "0"

                }}
                onClick={close}
            >
                <CloseIcon 
                    style={{fontSize: "50px"}}
                />
            </HomeButton>
            <Snackbar open={alertMessageOpen} autoHideDuration={5000} onClose={closeAlert}>
                <Alert onClose={closeAlert} severity={alertType} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default CreateLayerMode;