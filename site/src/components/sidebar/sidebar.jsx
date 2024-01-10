import React, { useEffect, useLayoutEffect, useState } from "react";

//Components
import LayerCard from "./layerCard/layerCard";
import FileCard from "./fileCard/fileCard";

//Contexts
import { useData } from "../../contexts/DataContext";
import { LayerCardContext } from "../../contexts/LayerCardContext";

//Styles
import {
  FileContainer,
  LayerContainer,
  SidebarContainer,
  Headings,
  SidebarElement,
  HeadingButton,
} from "../../styles/styles";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

//New Files
import arealbruk from "../../files/arealbruk.json";
import vann from "../../files/vann.json";
import bygning from "../../files/bygning.json";
import veg from "../../files/veg.json";

function Sidebar(props) {
  const [_data] = useData();
  const [fileIcon, setFileIcon] = useState(<ArrowDropDownIcon />);

  const [sidebarHeight, setsidebarHeight] = useState(window.innerHeight);
  const [SidebarElementFHeight, SidebarElementFHeightHeight] = useState(60);
  const [SidebarElementLHeight, setSidebarElementLHeight] = useState(0);
  const [layerContainerHeight, setlayerContainerHeight] = useState(0);
  const [layerList, setLayerList] = useState(<ul></ul>);

  const [showFileContainer, setShowFileContainer] = useState("none");

  const toggleFileDisplay = () => {
    showFileContainer === "none"
      ? setShowFileContainer("block")
      : setShowFileContainer("none");
  };

  useEffect(() => {
    setLayerList(
      <ul
        style={{
          listStyleType: "none",
          margin: "0",
          padding: "0",
          marginTop: "10px",
          width: "100%",
        }}
      >
        {_data.map((layer, i) => {
          return (
            <li id={i} key={i} style={{ position: "relative", width: "100%" }}>
              <LayerCardContext>
                <LayerCard
                  key={layer.id}
                  id={layer.id}
                  name={layer.name}
                  colour={layer.colour}
                  data={layer.data}
                  value={layer.value}
                />
              </LayerCardContext>
            </li>
          );
        })}
      </ul>
    );
  }, [_data]);

  useEffect(() => {
    showFileContainer === "none"
      ? setFileIcon(<ArrowDropDownIcon />)
      : setFileIcon(<ArrowDropUpIcon />);
  }, [showFileContainer]);

  useLayoutEffect(() => {
    updateHeights();
    window.addEventListener("resize", updateHeights);
    return () => window.removeEventListener("resize", updateHeights);
  }, [showFileContainer]);

  // Calculate heights
  function updateHeights() {
    ////Calculate the height of the sidebar
    //Window innerHeight
    let windowHeight = window.innerHeight;
    //Sidebar height
    let SidebarHeight = windowHeight;

    ////Calculate height of SidebarElementF
    //SidebarElementF height
    let SidebarElementFHeight;
    showFileContainer === "block"
      ? (SidebarElementFHeight = 260)
      : (SidebarElementFHeight = 60);

    ////Calculate height of SidebarElementL
    //SidebarElementL height
    let SidebarElementLHeight = SidebarHeight - SidebarElementFHeight;

    ////Calculate height of layerContainer
    //layerContainer height
    let layerContainerHeight = SidebarElementLHeight - 60;

    //Set heights
    setsidebarHeight(SidebarHeight);
    SidebarElementFHeightHeight(SidebarElementFHeight);
    setSidebarElementLHeight(SidebarElementLHeight);
    setlayerContainerHeight(layerContainerHeight);
  }

  return (
    <SidebarContainer
      id="SideBar"
      height={sidebarHeight}
      maxHeight={sidebarHeight}
      sx={{ display: props.display }}
    >
      <SidebarElement id="SidebarElementF" height={SidebarElementFHeight}>
        <Headings>
          <h1>Files</h1>
          <HeadingButton onClick={toggleFileDisplay}>{fileIcon}</HeadingButton>
        </Headings>
        <FileContainer id="FileContainer" display={showFileContainer}>
          <FileCard fileName={"Arealbruk"} file={arealbruk} />
          <FileCard fileName={"Vann"} file={vann} />
          <FileCard fileName={"Bygning"} file={bygning} />
          <FileCard fileName={"Veg"} file={veg} />
        </FileContainer>
      </SidebarElement>
      <SidebarElement id="SidebarElementL" height={SidebarElementLHeight}>
        <Headings>
          <h1>Layers </h1>
          <h1>#{_data.length}</h1>
        </Headings>
        <LayerContainer id="LayerContainer" maxHeight={layerContainerHeight}>
          {layerList}
        </LayerContainer>
      </SidebarElement>
    </SidebarContainer>
  );
}

export default Sidebar;
