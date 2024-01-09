import React, {useState, useEffect } from "react";

//Components
import ChangeName from "./changeName/changeName";
import Colourchanger from "./colourChanger/colourChanger";

//Contexts
import { useLayer } from "../../../../contexts/LayerCardContext";

//Styles
import { MenuItem } from "@mui/material";
import { Colourchangercontainer, LCard, ButtonIcon, ShowSwitch, CardName, LCardDropDown, LayerCardButtons} from "../../../muiElements/styles";
import CircleIcon from '@mui/icons-material/Circle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SettingsIcon from '@mui/icons-material/Settings';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CloseIcon from '@mui/icons-material/Close';

//Div
import { v4 as uuid } from "uuid";


function LayerCard(props) {
    //initialize layer object
    const [id, setId] = useState(props.id);
    const [name, setCardName] = useState(props.name);
    const [colour, setColour] = useState(props.colour);
    const [colourChanger, setColourChanger] = useState(null);
    const [settingsMenu, setSettingsMenu] = useState(null);
    const [showChangeName, setShowChangeName] = useState("none");
    const [removeItemFromDataL, handleCheckboxChangeL, handleColourChangeL, changeLayerNameL] = useLayer();

    //checkbox value
    const [checkboxValue, setCheckboxValue] = useState(props.value);
    
    //Change colour on colourchange button to match layer colour
    useEffect(() => {
        setColour(props.colour);
    }, [props.colour])

    //Change checkbox value on checkbox change
    function handleCheckbox(id){
        setCheckboxValue(!checkboxValue)
        handleCheckboxChangeL(id);
    }

    // ColorChangerToggler
    const openColourChanger = e => {
        setColourChanger(e.currentTarget);
    };
    
    //Close colour changer
    const closeColourChanger = () => {
        setColourChanger(null);
    };

    //Open settings menu
    const openSettingsMenu = e => {
        setSettingsMenu(e.currentTarget);
    };

    //Close Settings menu
    const closeSettingsMenu = () => {
        setSettingsMenu(null);
    };

    //Remove this layer from data
    function deleteLayer(){
        removeItemFromDataL(id);
    }

    //Change name
    function changeName(){
        showChangeName === "none" ? setShowChangeName("block") : setShowChangeName("none");
    }

    //Change name on layercard
    function changeCardName(newName){
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
                    <ShowSwitch margin="auto" checked = {checkboxValue} onClick={()=>handleCheckbox(id)} />
                    
                    <ButtonIcon
                        onClick={openColourChanger}
                    >
                        <CircleIcon style={{color: colour}}/>
                    </ButtonIcon>
                    
                    <LCardDropDown
                        id="simple-menu"
                        anchorEl={colourChanger}
                        keepMounted
                        open={Boolean(colourChanger)}
                        onClose={closeColourChanger}

                        sx={{
                            position: "absolute",
                            top: "0px",
                            left: "-100px",
                        }}
                    >
                        <Colourchangercontainer>
                            <Colourchanger id = {id} colour = {props.colour}/>
                            <ButtonIcon
                                onClick={() => closeColourChanger()}
                                style={{
                                    position: "absolute",
                                    right:"0", 
                                    top: "0",
                                    margin: "10px"}}
                            >
                                <CloseIcon style={{fontSize: "30px"}}/>
                            </ButtonIcon>
                        </Colourchangercontainer>
                    </LCardDropDown>
                    
                    <ButtonIcon
                        onClick={openSettingsMenu}
                    >
                        <SettingsIcon/>
                    </ButtonIcon>

                    <LCardDropDown 
                        id="settings-menu"
                        anchorEl = {settingsMenu}
                        keepMounted
                        open={Boolean(settingsMenu)}
                        onClose={closeSettingsMenu}
                    >
                        <MenuItem key={uuid()} style={{width: "50px", padding:"0px"}}>
                            <ButtonIcon onClick={()=> changeName()}>{<DriveFileRenameOutlineIcon/>}</ButtonIcon>
                        </MenuItem>
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
