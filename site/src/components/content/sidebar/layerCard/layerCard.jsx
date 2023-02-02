import React, {useState} from "react";
import "@mui/material";
import { Card, Checkbox, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Input, InputAdornment  } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { ColourChanger, LCard } from "../../../muiElements/styles";
import { v4 as uuid } from "uuid";
import { useData } from "../../../../contexts/DataContext";
import { useEffect } from "react";

function LayerCard(props) {
    //initialize layer object
    const [id, setId] = useState(props.id);
    const [name, setName] = useState(props.name);
    const [colour, setColour] = useState();
    const [data, setLayerData] = useState(props.data);
    const [layer, setLayer] = useState([ name, colour, data])
    // const [layer, setLayer] = useState(<GeoJSON id = {props.id} style = {{color:colour}} data={props.data.features} onEachLayer/>);
    
    //checkbox value
    const [value, setValue] = useState(props.value);
    

    useEffect (() => {
        setColour(props.colour);
    }, [])
   
    
    const colours = [
        "Red",
        "Blue",
        "Green",
        "Yellow",
        "Orange",
        "Purple",
        "Pink",
        "Brown",
        "Grey",
        "Black",
        "White",
    ];
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

    const [_data, setData, clearData, removeItemFromData, handleCheckboxChange, handleColourChange] = useData()

    return (
        <LCard className="card" variant="outlined">
            <h5>{name}</h5>
            <Checkbox className="elements" checked = {value} onClick={()=>handleCheckbox(id)} ></Checkbox>
            <button onClick={() => removeItemFromData(id)} >Delete</button>
            <ColourChanger className="elements" sx={{width:40, height: 60}} > {/*sx={{ m: 1, mt: 5 }}*/}
                <Select 
                    multiple
                    displayEmpty
                    value={[]}
                    style={{backgroundColor: colour, color: "black", fontWeight: "bold"}}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <em>{}</em>;
                        } else{
                            return <em>{}</em>;
                        }
                    }}
                    >
                    <MenuItem id="chosenColour" >
                        <em></em>
                    </MenuItem>
                    {colours.map((colour) => (
                        <MenuItem
                            key={colour}
                            style={getColour(colour)}
                            // onClick={() => setColour(colour)}
                            onClick={() => handleColour(colour)}
                        >
                            {colour}
                        </MenuItem>
                    ))}
                </Select>
            </ColourChanger>
        </LCard>
    )
}

export default LayerCard;