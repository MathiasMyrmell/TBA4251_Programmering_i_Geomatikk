import React, {useState } from "react";
//Styles
import { Headings, AnalysisC, InputField, ButtonIcon} from "../../../../muiElements/styles";
import CloseIcon from '@mui/icons-material/Close';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';


function ChangeName(props) {
    const [newName, setName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function closeWindow() {
        setName("")
        setErrorMessage("")
        props.setShow("none");
    }

    function changeName(){
        if(validName(newName)){
            props.setNewName(newName);
            closeWindow();
        }
    }

    function setNewName(newName){
        console.log("newName", newName)
        validName(newName);
        setName(newName);
    }

    function validName(name){
        if(name === ""){
            setErrorMessage("Name cannot be empty")
            return false;
        }else if(name.replace(/\s/g, '').length === 0){
            setErrorMessage("Name cannot only contain spaces")
            return false;
        }else if(name[0] === " "){
            setErrorMessage("Name cannot start with a space")
            return false;
        }
        setErrorMessage("")
        return true;
    }

    return (
        <>
            <AnalysisC style = {{display: props.show}}>
                <Headings>
                    <h1>{"Change name"}</h1>
                </Headings>
                <ButtonIcon
                    onClick={() => closeWindow()}
                    style={{position: "fixed",right:"0", top: "0", margin: "10px"}}
                >
                    <CloseIcon style={{fontSize: "40px", position: "fixed",right:"0", top: "0", margin: "10px"}}/>
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
                    onChange = {(e) => setNewName(e.target.value)}
                />

                <ButtonIcon
                    onClick={()=> changeName()}
                    style={{position: "fixed",right:"0", bottom: "0", margin: "10px"}}
                >
                    <DriveFileRenameOutlineIcon style={{width: "50px", fontSize: "40px"}}/>
                </ButtonIcon>


            </AnalysisC>
        </>
    )
}
export default ChangeName;