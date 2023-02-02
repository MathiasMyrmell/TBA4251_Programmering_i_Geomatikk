import React from "react";
import { useState, useEffect } from 'react';
import "./analysisMenu.css";
import { useData } from "../../../../contexts/DataContext";
import { Card, Checkbox, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Input, InputAdornment  } from "@mui/material";


function AnalysisMenu() {
  const { height, width } = useWindowDimensions();
  const [layer, setLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
  const [features, setFeatures] = useState([]);

  const [data, setData, clearData, removeItemFromData, handleCheckboxChange, handleColourChange] = useData()



  function featureSelection(close){
    var analysisWindow = document.getElementById("analysisWindow");
    var analysisWindowContainer = document.getElementById("analysisWindowContainer");
    if(close){
      analysisWindow.style.display = "block";
      let containerHeight = analysisWindowContainer.clientHeight;
      let paddingTop = (height/2)-(containerHeight/2);
      analysisWindowContainer.style.marginTop = paddingTop + "px";
      analysisWindowContainer.style.marginBottom = paddingTop + "px";
    }else{
      analysisWindow.style.display = "none";
    }
  }


  function choseLayer(target){
    setLayer(target);
    let layerData = data.find((layer) => layer.id === target.value).data;
    console.log(layerData);
    setFeatures(layerData);
  }


  return (
    <>
      <div id = "analysisContainer">
        <button className="button" onClick={()=>featureSelection(true)}>Feature Selection</button>
        <button>Buffer analysis</button>
      </div>
      <div id = "analysisWindow" style={{display: "None"}} >{/*onClick={() => featureSelection(false)}*/}
        <div id = "analysisWindowContainer">
          <button id = "closeButton" onClick={() => featureSelection(false)}>Close</button>
          <InputLabel id="demo-simple-select-label">Layer</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="select"
              // displayEmpty
              value={layer.value}
              onChange={(e) => choseLayer(e.target)}
              style={{width: "100%"}}
            >
              <MenuItem id="chosenColour" >
                <em></em>
              </MenuItem>
              {data.map((layer) => (
                <MenuItem
                    key={layer.id}
                    value={layer.id}

                    // style={getColour(colour)}
                    // onClick={() => setColour(colour)}
                    // onClick={() => handleColour(colour)}
                >
                    {layer.name}
                </MenuItem>
                
              ))}
            </Select>

            {/* <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

        </div>
      </div>
    </>
    )
}

export default AnalysisMenu;



function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
