import React, {useState} from "react";
import "@mui/material";
import { MenuItem, Menu } from "@mui/material";
import { LCard, ButtonIcon, ShowSwitch, CardName} from "../../../muiElements/styles";
import { v4 as uuid } from "uuid";
import { useData } from "../../../../contexts/DataContext";
import { useEffect } from "react";
import CircleIcon from '@mui/icons-material/Circle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SettingsIcon from '@mui/icons-material/Settings';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ChangeName from "./changeName/changeName";

function LayerCard(props) {
    //initialize layer object
    const [id, setId] = useState(props.id);
    const [name, setCardName] = useState();//props.name
    const [colour, setColour] = useState();
    const [colourChanger, setColourChanger] = useState(null);
    const [settingsMenu, setSettingsMenu] = useState(null);
    const [showChangeName, setShowChangeName] = useState("none");
    const [data, setData, layer, setLayer, bufferDistance, setBufferDistance, analysis, setAnalysis, clearData, removeItemFromData, handleCheckboxChange, handleColourChange] = useData()

    //checkbox value
    const [checkboxValue, setCheckboxValue] = useState(props.value);
    
 
    useEffect (() => {
        setColour(props.colour);
        setName();
    }, [])

    useEffect(() => {
        let layer = data.find((layer) => layer.id === id);
        setCardName(layer.name);
    }, [data])

    function setName(){
        let layer = data.find((layer) => layer.id === id);
        setCardName(layer.name);

    }
 
    function handleCheckbox(id){
        setCheckboxValue(!checkboxValue)
        handleCheckboxChange(id);
    }

    function handleColour(c){
        setColour(c);
        handleColourChange(id, c);
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


    const openColourChanger = e => {
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
        console.log("delete layer");
        removeItemFromData(id);
    }

    function changeName(){
        setShowChangeName("block");
        setSettingsMenu(null);
    }

    const settingsChoices = [
        {
            title: "Change Name",
            icon: <DriveFileRenameOutlineIcon/>,
            handler: changeName
        },
        {
            title: "Delete Layer",
            icon: <DeleteForeverIcon />,
            handler: deleteLayer
        },
    ];

    function closeChangeName(){
        setShowChangeName("none");
    }

    return (
        <LCard className="card" variant="outlined">

            <CardName
                id="standard-textarea"
                multiline
                variant="standard"
                InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                  }}
                defaultValue={name}
            > 
                {name}
            </CardName>

            <ShowSwitch margin="auto" checked = {checkboxValue} onClick={()=>handleCheckbox(id)} />
            
            <ButtonIcon
                onClick={openColourChanger}
                // disableRipple
            >
                <CircleIcon style={{color: colour}}/>
            </ButtonIcon>
            <Menu
                id="simple-menu"
                anchorEl={colourChanger}
                keepMounted
                open={Boolean(colourChanger)}
                onClose={closeColourChanger}
            >
                {colours.map(colour => (
                <MenuItem onClick={()=>handleColour(colour)} key={uuid()}>
                    {/* {item.icon} */}
                    {<CircleIcon style={{color:colour}}/>}
                </MenuItem>
                ))}
            </Menu>
            
            <ButtonIcon
                onClick={openSettingsMenu}
            >
                <SettingsIcon 
                    style={{color: "black"}}
                />
            </ButtonIcon>
            <Menu 
                id="settings-menu"
                anchorEl = {settingsMenu}
                keepMounted
                open={Boolean(settingsMenu)}
                onClose={closeSettingsMenu}
            >
                {settingsChoices.map(item => (
                    <MenuItem onClick={()=> item.handler()} key={uuid()}>
                        {item.icon}
                    </MenuItem>
                ))}
            </Menu>
            
            <ChangeName id={id} name ={"Change Name"} oldName = {name} display={showChangeName} closeChangeName={closeChangeName}/>
        </LCard>
    )
}

export default LayerCard;