import React, {useState} from "react";
import "@mui/material";
import { TextField, Card, Checkbox, Switch, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Menu, Input, InputAdornment, IconButton  } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { ColourChanger, LCard, ButtonIcon, ShowSwitch, CardName} from "../../../muiElements/styles";
import { v4 as uuid } from "uuid";
import { useData } from "../../../../contexts/DataContext";
import { useEffect } from "react";
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SettingsIcon from '@mui/icons-material/Settings';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

function LayerCard(props) {
    //initialize layer object
    const [id, setId] = useState(props.id);
    const [name, setName] = useState(props.name);
    const [colour, setColour] = useState();
    const [data, setLayerData] = useState(props.data);
    const [layer, setLayer] = useState([ name, colour, data])
    const [_data, setData, clearData, removeItemFromData, handleCheckboxChange, handleColourChange] = useData()

    //checkbox value
    const [value, setValue] = useState(props.value);
    
 
    useEffect (() => {
        setColour(props.colour);
    }, [])
   

    function getColour(colour){
        return {
            backgroundColor: colour,
            color: colour,
        }
    }

    function getLayer(){
        return layer;
    }
    
    function handleCheckbox(id){
        setValue(!value)
        handleCheckboxChange(id, !value);
    }

    function handleColour(c){
        setColour(c);
        handleColourChange(id, c);
    }

    


    const colours = [
        {
          icon: <CircleIcon style={{color:"red"}}/>,
          color: "red"
        },
        {
            icon: <CircleIcon style={{color:"Blue"}}/>,
            color: "Blue"
          },
          {
            icon: <CircleIcon style={{color:"Green"}}/>,
            color: "Green"
          },
          {
            icon: <CircleIcon style={{color:"Yellow"}}/>,
            color: "Yellow"
          },
          {
            icon: <CircleIcon style={{color:"Orange"}}/>,
            color: "Orange"
          },
          {
            icon: <CircleIcon style={{color:"Purple"}}/>,
            color: "Purple"
          },
          {
            icon: <CircleIcon style={{color:"Pink"}}/>,
            color: "Pink"
          },
          {
            icon: <CircleIcon style={{color:"Brown"}}/>,
            color: "Brown"
          },
          {
            icon: <CircleIcon style={{color:"Grey"}}/>,
            color: "Grey"
          },
          {
            icon: <CircleIcon style={{color:"Black"}}/>,
            color: "Black"
          },
    ];
    const [colourChanger, setColourChanger] = useState(null);
    const [settingsMenu, setSettingsMenu] = useState(null);

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
        removeItemFromData(id);
    }

    function changeName(){
    //TODO
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


    return (
        <LCard className="card" variant="outlined">

            <CardName
                id="standard-textarea"
                multiline
                variant="standard"
                InputProps={{
                    readOnly: true,
                    disableUnderline: true
                  }}
                defaultValue={name}
            > 
                {name}
            </CardName>

            <ShowSwitch margin="auto" checked = {value} onClick={()=>handleCheckbox(id)} />
            
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
                {colours.map(item => (
                <MenuItem onClick={()=>handleColour(item.color)} key={uuid()}>
                    {item.icon}
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
                    <MenuItem onClick={()=>item.handler()} key={uuid()}>
                        {item.icon}
                    </MenuItem>
                ))}
            </Menu>

        </LCard>
    )
}

export default LayerCard;