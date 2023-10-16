import React, {useState, useEffect } from "react";

//Components
import ChangeName from "./changeName/changeName";

//Contexts
import { useLayer } from "../../../../contexts/LayerCardContext";


//Styles
import { MenuItem } from "@mui/material";
import { LCard, ButtonIcon, ShowSwitch, CardName, LCardDropDown, LayerCardButtons} from "../../../muiElements/styles";
import CircleIcon from '@mui/icons-material/Circle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SettingsIcon from '@mui/icons-material/Settings';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

//Div
import { v4 as uuid } from "uuid";


function LayerCard(props) {
    //initialize layer object
    const [id, setId] = useState(props.id);
    const [name, setCardName] = useState(props.name);//props.name
    const [colour, setColour] = useState(props.colour);
    const [colourChanger, setColourChanger] = useState(null);
    const [settingsMenu, setSettingsMenu] = useState(null);
    const [showChangeName, setShowChangeName] = useState("none");

    const [removeItemFromDataL, handleCheckboxChangeL, handleColourChangeL, changeLayerNameL, getLayerName] = useLayer();
    const [errorMessage, setErrorMessage] = useState("");


    //checkbox value
    const [checkboxValue, setCheckboxValue] = useState(props.value);
    
    useEffect (() => {
        setColour(props.colour);
        setName();
    }, [])


    function setName(){
        // let layer = data.find((layer) => layer.id === id);
        // setCardName(layer.name);
        let layerName = getLayerName(id);
        setCardName(layerName);
    }
 
    function handleCheckbox(id){
        setCheckboxValue(!checkboxValue)
        handleCheckboxChangeL(id);
        // handleCheckboxChange(id);
    }

    function handleColour(c){
        setColour(c);
        handleColourChangeL(id, c);
        // handleColourChange(id, c);
        closeColourChanger();
    }

    const colours = [
        "red",
        "blue",
        "green",
        "yellow",
        "orange",
        "purple",
        "pink",
        "brown",
        "grey",
        "black",
        "white"
    ]

    // ColorChangerToggler
    const openColourChanger = e => {
        console.log("openColourChanger", e.currentTarget)
        setColourChanger(e.currentTarget);
    };
    const closeColourChanger = () => {
        setColourChanger(null);
    };

    const openSettingsMenu = e => {
        setSettingsMenu(e.currentTarget);
    };
    const closeSettingsMenu = () => {
        setSettingsMenu(null);
    };

    function deleteLayer(){
        removeItemFromDataL(id);
        // removeItemFromData(id);
    }


    //Change name
    function changeName(){
        if(showChangeName === "none"){
            setShowChangeName("block");
        }else{
            setShowChangeName("none");
        }
    }

    function changeCardName(newName){
        // updateName(id, newName);
        changeLayerNameL(id, newName)
        setCardName(newName);
    }



    return (
        <>
            <LCard className="card" variant="outlined">
                <CardName
                    id="standard-textarea"
                    multiline
                    variant="standard"
                    InputProps={{
                        readOnly: true,
                        disableUnderline: true,
                    }}
                    value={name}
                > 
                </CardName>

                <LayerCardButtons>
                    {/* Switch visibility */}
                    <ShowSwitch margin="auto" checked = {checkboxValue} onClick={()=>handleCheckbox(id)} />
                    
                    {/* Color changer button */}
                    <ButtonIcon
                        onClick={openColourChanger}
                        // disableRipple
                    >
                        <CircleIcon style={{color: colour}}/>
                    </ButtonIcon>
                    
                    {/* Color changer menu */}
                    <LCardDropDown
                        id="simple-menu"
                        anchorEl={colourChanger}
                        keepMounted
                        open={Boolean(colourChanger)}
                        onClose={closeColourChanger}
                    >
                        {colours.map(colour => (
                            <MenuItem onClick={()=>handleColour(colour)} key={uuid()}>
                                {<CircleIcon style={{color:colour}}/>}
                            </MenuItem>
                        ))}
                    </LCardDropDown>
                    
                    {/* Settings button */}
                    <ButtonIcon
                        onClick={openSettingsMenu}
                    >
                        <SettingsIcon/>
                    </ButtonIcon>

                    {/* Settings menu */}
                    <LCardDropDown 
                        id="settings-menu"
                        anchorEl = {settingsMenu}
                        keepMounted
                        open={Boolean(settingsMenu)}
                        onClose={closeSettingsMenu}
                    >
                        {/* Change name */}
                        <MenuItem key={uuid()} style={{width: "50px", padding:"0px"}}>
                            <ButtonIcon onClick={()=> changeName()}>{<DriveFileRenameOutlineIcon/>}</ButtonIcon>
                        </MenuItem>
                        {/* Delete layer */}
                        <MenuItem key={uuid()} style={{width: "50px", padding:"0px"}}>
                            <ButtonIcon onClick={()=> deleteLayer()}>{<DeleteForeverIcon />}</ButtonIcon>
                        </MenuItem>
                    </LCardDropDown>
                </LayerCardButtons>
            </LCard>
            <ChangeName show = {showChangeName} oldName = {name} setShow = {setShowChangeName} setNewName = {changeCardName}/>
        </>
    )
}

export default LayerCard;
