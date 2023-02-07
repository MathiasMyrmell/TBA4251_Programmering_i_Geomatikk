import React from "react";
import { useState, useEffect } from 'react';
import { AnalysisBackground, AnalysisC, InputField, DropDownMenu , ButtonIcon} from "../../../../muiElements/styles";
import { useData } from "../../../../../contexts/DataContext";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CloseIcon from '@mui/icons-material/Close';

function ChangeName(props){
    const [show, setShow] = useState(props.display);
    const [newName, setNewName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData, layer, setLayer, bufferDistance, setBufferDistance, analysis, setAnalysis, clearData, removeItemFromData, handleCheckboxChange, handleColourChange, changeLayerName] = useData()
    

    useEffect(() => {
        setShow(props.display);
    }, [props.display]);


    function setName(name){
        setNewName(name);
    }

    function closeWindow(){
        clearInput();
        props.closeChangeName("close");
    }

    function clearInput(){
        setNewName("");
        setErrorMessage("");
    }

    function changeName(){
        let valid = checkValidName();
        if(valid===true){
            changeLayerName(props.id, newName);
            closeWindow();
        }
        else{
            setErrorMessage(valid);
        }
        
    }

    function checkValidName(){
        if(newName === ""){
            return "Name cannot be empty";
        }else{
            return true;
        }
    }

    return (
        <AnalysisBackground style={{display: show}}>
            <AnalysisC >
                <h1>{props.name}</h1>
                <ButtonIcon
                    onClick={() => closeWindow()}
                    style={{position: "fixed",right:"0", top: "0", margin: "10px"}}
                >
                    <CloseIcon style={{color: "black", fontSize: "40px"}}/>
                </ButtonIcon>
                <InputField 
                    // id="outlined-basic"
                    label="Old name"
                    variant="outlined"
                    value={props.oldName}
                    InputProps={{
                        readOnly: true,
                      }}
                />
                <InputField 
                    // id="outlined-basic"
                    label="New name"
                    variant="outlined"
                    value={newName}
                    helperText = {errorMessage}
                    onChange = {(e) => setName(e.target.value)}
                />
                <ButtonIcon
                    onClick={()=> changeName()}
                    style={{position: "fixed",right:"0", bottom: "0", margin: "10px"}}
                >
                    <DriveFileRenameOutlineIcon style={{width: "50px", fontSize: "40px"}}/>
                </ButtonIcon>
            </AnalysisC>
            
        </AnalysisBackground>
    )
}

export default ChangeName;