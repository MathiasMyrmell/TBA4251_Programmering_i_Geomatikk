import React from "react";
import { useState } from "react";
//Components
import BuffAnalysis from "./bufferAnalysis";

//Contexts
import { useData } from "../../../../contexts/DataContext";

//Styles
import { InputLabel, MenuItem } from "@mui/material";
import {
  ButtonIcon,
  DropDownMenu,
  InputField,
  DropDownFieldError,
  DropDownField,
} from "../../../../styles/styles";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

//Div
import { v4 as uuid } from "uuid";

function BufferAnalysis() {
  const [
    data,
    setData,
    removeData,
    analysis,
    prepareLayersForAnalysis,
    displayAnalysis,
    showAnalysis,
    setShowAnalysis,
  ] = useData();
  const [layer, setLayer] = useState({
    id: "none",
    name: "none",
    colour: "none",
    data: "none",
    value: "",
  });
  const [bufferDistance, setBufferDistance] = useState("");
  const [bufferDistanceErrorMessage, setbufferDistanceErrorMessage] = useState(" ");
  const [layerErrorMessage, setLayerErrorMessage] = useState("");

  // //Functions for execute button
  // Clear input fields
  function clearInput() {
    setBufferDistance("");
    setLayer({
      id: "none",
      name: "none",
      colour: "none",
      data: "none",
      value: "",
    });
  }

  ////Functions for buffer analysis
  //Chose layer for feature selection
  function choseLayer(target) {
    setLayer(target);
  }

  //Buffer Analysis new
  function bufferAnalysis() {
    let validBuffer = checkValidBufferDistance();
    let validLayer = checkValidLayer();
    if (validBuffer !== true || validLayer !== true) {
      return;
    }

    //Prepare layer for analysis
    let baseLayer = prepareLayersForAnalysis(layer);

    //Create buffer around layer
    const analysis = new BuffAnalysis(baseLayer.data, bufferDistance);
    // If analysis failed
    if(analysis.result === null) {
      setbufferDistanceErrorMessage(
        "Analysis failed. Layers to big. Try with smaller layers."
      );
      return;
    }

    //Create layer
    let newLayer = {
      id: uuid(),
      name: baseLayer.name + "-buffer-" + bufferDistance + "m",
      colour: "",
      data: analysis.result,
      value: true,
    };
    setData(newLayer);

    //Clear input fields
    clearInput();
    setShowAnalysis("none");
  }

  //Check if layer is valid
  function checkValidLayer() {
    if (layer.id === "none") {
      setLayerErrorMessage("A layer must be selected");
      return false;
    } else {
      setLayerErrorMessage("");
      return true;
    }
  }

  //Check if buffer distance is valid
  function checkValidBufferDistance() {
    if (bufferDistance <= 0) {
      setbufferDistanceErrorMessage("At least one feature must be selected");
      return false;
    } else {
      setbufferDistanceErrorMessage(" ");
      return true;
    }
  }

  return (
    <>
      <DropDownMenu>
        <InputLabel id="demo-simple-select-label">Layer</InputLabel>
        <DropDownField
          labelId="demo-simple-select-label"
          id="select"
          value={layer.value}
          label="Layer"
          onChange={(e) => choseLayer(e.target)}
        >
          <MenuItem id="chosenColour" key={uuid()}>
            <em></em>
          </MenuItem>
          {data.map((layer) => (
            <MenuItem key={layer.id} value={layer.id}>
              {layer.name}
            </MenuItem>
          ))}
        </DropDownField>
        <DropDownFieldError>{layerErrorMessage}</DropDownFieldError>
      </DropDownMenu>

      <InputField
        // id="outlined-basic"
        label="Buffer Distance (m)"
        variant="outlined"
        value={bufferDistance}
        helperText={bufferDistanceErrorMessage}
        onChange={(e) => setBufferDistance(e.target.value)}
      />
      <ButtonIcon
        onClick={() => bufferAnalysis()}
        style={{ position: "fixed", right: "0", bottom: "0", margin: "10px" }}
      >
        <NoteAddIcon style={{ fontSize: "40px" }} />
      </ButtonIcon>
    </>
  );
}

export default BufferAnalysis;
