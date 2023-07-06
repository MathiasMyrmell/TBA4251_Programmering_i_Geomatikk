import React, {useEffect, useLayoutEffect, useState} from "react";
import "./sidebar.css";
import LayerCard from "./layerCard/layerCard";

import { useData } from "../../../contexts/DataContext";
import { FileContainer, LayerContainer, SidebarContainer, Headings, SidebarElement, HeadingButton} from "../../muiElements/styles";
import FileCard from "./fileCard/fileCard";
//Files
import arealbruk from "../../../files/arealbruk.json";
import vann from "../../../files/vann.json";

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';



function Sidebar(props) {

    const [_data] = useData();
    const [fileIcon, setFileIcon] = useState(<ArrowDropDownIcon />);

    const [sidebarHeight, setsidebarHeight] = useState(window.innerHeight);
    const [SidebarElementFHeight, SidebarElementFHeightHeight] = useState(60);
    const [SidebarElementLHeight, setSidebarElementLHeight] = useState(0);
    const [layerContainerHeight, setlayerContainerHeight] = useState(0);

    const [showFileContainer, setShowFileContainer] = useState("none");

    const toggleFileDisplay = () => {
        if(showFileContainer === "none"){
            setShowFileContainer("block");
        }else{
            setShowFileContainer("none");
        }
    };

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
                        <FileCard fileName = {"Vann"} file ={vann}/>
                        <FileCard fileName = {"Arealbruk"} file ={arealbruk}/>
                        <FileCard fileName = {"Arealbruk"} file ={arealbruk}/>
                    </FileContainer> 
            </SidebarElement>
            <SidebarElement id = "SidebarElementL"  height = {SidebarElementLHeight}>
                <Headings>
                    <h1>Layers</h1>
                </Headings>
                    <LayerContainer id="LayerContainer"  maxHeight = {layerContainerHeight}>
                        <ul>
                            {_data.map((layer, i) => {
                                return(
                                    <li id={i} key={i}>
                                        <LayerCard key={layer.id} id = {layer.id} name = {layer.name} colour = {layer.colour} data = {layer.data} value = {layer.value} />
                                    </li>
                                ) 
                            })}
                        </ul>
                    </LayerContainer>
            </SidebarElement>
        </SidebarContainer>


    )
}

export default Sidebar;