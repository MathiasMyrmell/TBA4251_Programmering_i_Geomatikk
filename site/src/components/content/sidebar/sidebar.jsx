import React, {useEffect, useState} from "react";
import "./sidebar.css";
import { v4 as uuid } from "uuid";
import LayerCard from "./layerCard/layerCard";

import { useData } from "../../../contexts/DataContext";
import { FileContainer, LayerContainer, SidebarContainer, Headings} from "../../muiElements/styles";
import FileCard from "./fileCard/fileCard";
//Files
import arealbruk from "../../../files/arealbruk.json";
import vann from "../../../files/vann.json";

function Sidebar(props) {

    // const [layers, setLayers] = useState([]);
    // const [layerCards, setLayerCards] = useState([]);
    const [_data, setData, clearData, removeItemFromData] = useData();


    return (
        <SidebarContainer style={{height: "90vh"}}>
            <Headings>
                <h1>Files</h1>
            </Headings>
            <FileContainer >
                <FileCard fileName = {"Vann"} file ={vann}/>
                <FileCard fileName = {"Arealbruk"} file ={arealbruk}/>
                <FileCard fileName = {"Arealbruk"} file ={arealbruk}/>
            </FileContainer> 
            <Headings>
                <h1>Layers</h1>
            </Headings>
            <LayerContainer>
                <ul>
                    {_data.map((layer, i) => {
                        return(
                            <li id={i} key={i}>
                                <LayerCard key={layer.id} id = {layer.id} name = {layer.name} colour = {layer.colour} data = {layer.data} value = {layer.value}/>
                            </li>
                        ) 
                    })}
                </ul>
            </LayerContainer>
        </SidebarContainer>
    )
}

export default Sidebar;