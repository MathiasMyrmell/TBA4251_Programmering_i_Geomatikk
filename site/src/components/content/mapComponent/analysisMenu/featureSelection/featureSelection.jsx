import React from "react";
import { useState, useEffect } from 'react';
// import "./featureSelection.css";
import { useData } from "../../../../../contexts/DataContext";


import { Box, Chip,  FormControl, InputLabel, Select, MenuItem, OutlinedInput} from "@mui/material";
import { v4 as uuid } from "uuid";
import { useTheme } from '@mui/material/styles';
import _ from "lodash";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}




function FeatureSelection(props) {
    // const { height, width } = useWindowDimensions();
    const [layer, setLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
    const [features, setFeatures] = useState([]);
    const [chosenFeatures, setChosenFeatures] = useState([]);
    const [data, setData] = useData()
    const theme = useTheme();
    const [show, setShow] = useState(props.display);
    
    useEffect(() => {
        setShow(props.display);
    }, [props.display]);

    function closeWindow(){
        clearInput();
        props.displayAnalysisWindow("close");
    }


    //Chose layer for feature selection
    function choseLayer(target){
        setLayer(target);
        let layerData = data.find((layer) => layer.id === target.value).data.features;
        filterFeatures(layerData);
    }

    //Filter features
    function filterFeatures(data){
        setFeatures([]);
        let newFeatures = [];
        newFeatures.push(data[0].properties.OBJTYPE)
        compareLoop: for( let i = 0; i < data.length; i++){
        let newFeature = data[i].properties.OBJTYPE;
        for(let j = 0; j <newFeatures.length; j++){
            if(newFeatures[j] === newFeature){
            continue compareLoop
            }
        }
        newFeatures.push(newFeature);
    }
    for(let i = 0; i < newFeatures.length; i++){
        setFeatures(features => [...features, newFeatures[i]]);
    }
    }


    //Create new layer with selected features
    function createNewLayer(){
        let baseLayer = data.find((l) => l.id === layer.value);
        console.log(baseLayer);
        let newFeatures = [];
        console.log(chosenFeatures);
        baseLayer.data.features.map(feature => {
            if(_.includes(chosenFeatures,feature.properties.OBJTYPE)){
                newFeatures.push(feature);
            }
        })
        let newData = {type:"FeatureCollection", features:newFeatures};
        let newLayer = {id:uuid(), name:baseLayer.name+"-feature-selecion", colour:"", data:newData, value:true};
        console.log(newLayer);
        setData(newLayer);
        clearInput();
    }


    function clearInput(){
        setChosenFeatures([]);
        setLayer({id:"none", name:"none", colour:"none", data:"none", value:""});
        setFeatures([]);
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setChosenFeatures(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };



  

    return (
        <div id = "analysisWindow" style={{display: show}} >{/*onClick={() => featureSelection(false)}*/}
            <div id = "analysisWindowContainer">
                <h1>Feature Selection</h1>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-simple-select-label">Layer</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="select"
                        value={layer.value}
                        label="Layer"
                        onChange={(e) => choseLayer(e.target)}
                    >
                        <MenuItem id="chosenColour" key={uuid()} >
                        <em></em>
                        </MenuItem>
                        {data.map((layer) => (
                        <MenuItem
                            key={layer.id}
                            value={layer.id}
                        >
                            {layer.name}
                        </MenuItem>
                        
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-chip-label">Features</InputLabel>
                    <Select
                    labelId="demo-multiple-chip-label"
                    id="featureSelect"
                    multiple
                    value={chosenFeatures}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    label="Features"
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                    >
                    {features.map((feature) => (
                        <MenuItem
                        key={uuid()}
                        value={feature}
                        style={getStyles(feature, chosenFeatures, theme)}
                        >
                        {feature}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <button id = "closeButton" onClick={() => closeWindow()}>Close</button>
                <button id="executeAnalysis" onClick={()=> createNewLayer()}>Select features</button>
            </div>
        </div>

    );
}

export default FeatureSelection;


// function getWindowDimensions() {
//     const { innerWidth: width, innerHeight: height } = window;
//     return {
//       width,
//       height
//     };
//   }
  
//   function useWindowDimensions() {
//     const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  
//     useEffect(() => {
//       function handleResize() {
//         setWindowDimensions(getWindowDimensions());
//       }
  
//       window.addEventListener('resize', handleResize);
//       return () => window.removeEventListener('resize', handleResize);
//     }, []);
  
//     return windowDimensions;
//   }
  