import React, {useEffect, useState} from "react";
import "./sidebar.css";
import { v4 as uuid } from "uuid";
import LayerCard from "./layerCard/layerCard";
import arealbruk from "../../../files/arealbruk.json";
import vann from "../../../files/vann.json";
import { useData } from "../../../contexts/DataContext";
import { LCard } from "../../muiElements/styles";

function Sidebar(props) {

    const [layers, setLayers] = useState([]);
    const [layerCards, setLayerCards] = useState([]);
    const [_data, setData, clearData, removeItemFromData] = useData();

    return (
        <div>
            <div style={{border:"1px solid black", width:"100%", height:"100px"}}>
                <label> <a>Vann</a><button onClick={()=> setData({ id: uuid(), name:"vann", colour: "", data: vann, value: true})}>Add layer</button></label><br/>
                <label> <a>Arealbruk</a><button onClick={()=> setData({ id: uuid(), name:"Arealbruk", colour: "", data: arealbruk, value: true})}>Add layer</button></label>
            </div>
            <button onClick={() => clearData()}> Remove layers</button>
            <button onClick={() => removeItemFromData("Vann")}> Remove vann</button>
            <div id="layerCardContainer">
                <ul>
                    {_data.map((layer, i) => {
                        return(
                            <li id={i} key={i}>
                                <LayerCard key={layer.id} id = {layer.id} name = {layer.name} colour = {layer.colour} data = {layer.data} value = {layer.value}/>
                            </li>
                        ) 
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;