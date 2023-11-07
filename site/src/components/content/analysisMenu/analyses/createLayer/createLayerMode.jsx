
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAnalysis } from "../../../../../contexts/AnalysisContext.jsx";
import { HomeButton, ButtonIcon } from "../../../../muiElements/styles.jsx";
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CloseIcon from '@mui/icons-material/Close';


function CreateLayerMode(){
    const [analysis, displayAnalysis,showAnalysis, setShowAnalysis, analyses, prepareLayersForAnalysis, addAreaToFeature, showAnalysisMenu, setShowAnalysisMenu, showCreateLayerMode, setShowCreateLayerMode] = useAnalysis();
    const [show, setShow] = useState("block")


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
        displayElements();
    }

    function cancel(){
        displayElements();
    }


    return(
        <>
            <HomeButton 
                sx = {{
                    display: show,
                    right: "50px",
                    bottom: "0"

                }}>
                <ButtonIcon>
                    <NoteAddIcon 
                        style={{fontSize: "50px"}}
                        onClick={createLayer}
                    />
                </ButtonIcon>
            </HomeButton>
            <HomeButton 
                sx = {{
                    display: show,
                    right: "120px",
                    bottom: "0"

                }}>
                <ButtonIcon>
                    <CloseIcon 
                        style={{fontSize: "50px"}}
                        onClick={cancel}
                    />
                </ButtonIcon>
            </HomeButton>

        </>
    )
}

export default CreateLayerMode;