import React, {useEffect, useLayoutEffect, useState} from "react";
import "./sidebar.css";
import LayerCard from "./layerCard/layerCard";

import { useData } from "../../../contexts/DataContext";
import { FileContainer, LayerContainer, SidebarContainer, Headings, SidebarElement, HeadingButton} from "../../muiElements/styles";
import FileCard from "./fileCard/fileCard";
import { LayerCardContext } from "../../../contexts/LayerCardContext";
//MUI
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
//Old Files
import arealbrukG from "../../../filesOld/arealbrukG.json";
import vannG from "../../../filesOld/vannG.json";
import vann1 from "../../../filesOld/vann.json";
import arealbruk1 from "../../../filesOld/arealbruk.json";
import arealbruk2 from "../../../filesOld/arealbruk2.json";
import copy from "../../../filesOld/copy.json";
import merge1 from "../../../filesOld/merge1.json";
//New Files
import arealbruk from "../../../files/arealbruk.json";
import vann from "../../../files/vann.json";
import bygning from "../../../files/bygning.json";



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
        if(showFileContainer === "none"){
            setShowFileContainer("block");
        }else{
            setShowFileContainer("none");
        }
    };


    useEffect(() => {
        setLayerList(<ul>
            {_data.map((layer, i) => {
                return(
                    <li id={i} key={i} style={{position: "relative"}}>
                        <LayerCardContext>
                            <LayerCard key={layer.id} id = {layer.id} name = {layer.name} colour = {layer.colour} data = {layer.data} value = {layer.value} />
                        </LayerCardContext>
                    </li>
                ) 
            })}
        </ul>)
    }, [_data])

    useEffect(() => {
        if(showFileContainer === "none"){setFileIcon(<ArrowDropDownIcon />);}
        else{setFileIcon(<ArrowDropUpIcon />);}
    }, [showFileContainer])


    useLayoutEffect (() => {
        updateHeights();
        window.addEventListener('resize', updateHeights);
        return () => window.removeEventListener('resize', updateHeights);

    }, [showFileContainer])
    
    // Calculate heights
    function updateHeights(){
        ////Calculate the height of the sidebar
        //Window innerHeight
        let windowHeight = window.innerHeight;
        //Sidebar height
        let SidebarHeight= windowHeight;

        ////Calculate height of SidebarElementF
        //SidebarElementF height
        let SidebarElementFHeight;
        if(showFileContainer === "block"){
            SidebarElementFHeight = 260;
        }else{
            SidebarElementFHeight = 60;
        }

        ////Calculate height of SidebarElementL
        //SidebarElementL height
        let SidebarElementLHeight = SidebarHeight-SidebarElementFHeight;

        ////Calculate height of layerContainer
        //layerContainer height
        let layerContainerHeight = SidebarElementLHeight-60;

        //Set heights
        setsidebarHeight(SidebarHeight);
        SidebarElementFHeightHeight(SidebarElementFHeight);
        setSidebarElementLHeight(SidebarElementLHeight);
        setlayerContainerHeight(layerContainerHeight);
    }


  

    return (
        <SidebarContainer id ="SideBar" height={sidebarHeight} maxHeight={sidebarHeight} sx={{display: props.display}}>
            <SidebarElement id = "SidebarElementF" height={SidebarElementFHeight} >
                <Headings>
                    <h1>Files</h1>
                    <HeadingButton
                        onClick={toggleFileDisplay}
                    >
                        {fileIcon}
                    </HeadingButton>
                </Headings>
                    <FileContainer id= "FileContainer" display={showFileContainer} >
                        <FileCard fileName = {"Arealbruk"} file ={arealbruk}/>
                        <FileCard fileName = {"Vann"} file ={vann}/>
                        <FileCard fileName = {"Bygning"} file ={bygning}/>
                        {/* Gamle filer */}
                        <FileCard fileName = {"ArealbrukG"} file ={arealbrukG}/>
                        <FileCard fileName = {"VannG"} file ={vannG}/>
                        <FileCard fileName = {"Merge1"} file ={merge1}/>
                        <FileCard fileName = {"Vann1"} file ={vann1}/>
                        <FileCard fileName = {"Arealbruk1"} file ={arealbruk1}/>
                        <FileCard fileName = {"Arealbruk2"} file ={arealbruk2}/>
                        <FileCard fileName = {"Copy"} file ={copy}/>

                    </FileContainer> 
            </SidebarElement>
            <SidebarElement id = "SidebarElementL"  height = {SidebarElementLHeight}>
                <Headings>
                    <h1>Layers </h1><h1>#{_data.length}</h1>
                </Headings>
                    <LayerContainer 
                        id="LayerContainer" 
                        maxHeight = {layerContainerHeight}
                    >
                        {layerList}

                    </LayerContainer>
            </SidebarElement>
        </SidebarContainer>
    )
}

export default Sidebar;