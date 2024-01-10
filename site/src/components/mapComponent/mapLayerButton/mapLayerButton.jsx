import React, { useState } from "react";

//Contexts
import { useMap } from "../../../contexts/MapContext";

//Styles
import {
  AnalysisC,
  HomeButton,
  ButtonIcon,
  Headings,
  BaseMapContainer,
} from "../../../styles/styles";
import LayersIcon from "@mui/icons-material/Layers";
import CloseIcon from "@mui/icons-material/Close";

function MapLayerButton() {
  const [map, setMap, baseMap, getBaseMaps, setBaseMapId] = useMap();
  const [showChangeBaseMap, setShowChangeBaseMap] = useState("none");

  function openWindow() {
    setShowChangeBaseMap((show) => (show === "none" ? "block" : "none"));
  }

  function closeWindow() {
    setShowChangeBaseMap("none");
  }

  function changeLayer(baseMapId) {
    setBaseMapId(baseMapId);
  }

  return (
    <>
      <HomeButton
        sx={{
          top: "80px",
          right: "0",
        }}
        onClick={openWindow}
      >
        <LayersIcon style={{ fontSize: "50px" }} />
      </HomeButton>

      <AnalysisC style={{ display: showChangeBaseMap, zIndex: 10000 }}>
        <Headings>
          <h1>{"Change basemap"}</h1>
        </Headings>
        <ButtonIcon
          onClick={() => closeWindow()}
          style={{ position: "fixed", right: "0", top: "0", margin: "10px" }}
        >
          <CloseIcon style={{ fontSize: "40px" }} />
        </ButtonIcon>
        {getBaseMaps().map((layer) => (
          <BaseMapContainer
            key={layer.id}
            onClick={() => changeLayer(layer.id)}
          >
            <img style={{ width: "100px", height: "100px" }} src={layer.img} />
          </BaseMapContainer>
        ))}
      </AnalysisC>
    </>
  );
}

export default MapLayerButton;
