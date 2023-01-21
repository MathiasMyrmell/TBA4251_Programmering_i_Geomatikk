import React, {useEffect, useState} from "react";
import "./sidebar.css";
import { v4 as uuid } from "uuid";
import LayerCard from "./layerCard/layerCard";
import arealbruk from "../../../files/arealbruk.json";
import vann from "../../../files/vann.json";
import { useData } from "../../../contexts/DataContext";
import { LCard } from "../../muiElements/styles";

function Sidebar(props) {

    

    // useEffect(() => {
    //     addLayer();
    // }, []);

    // function addLayer(layer){
    //     if(layers.length===0){
    //         var list1 = [];
    //         var uniqueId = uuid();
    //         list1.push(createNewCard(uniqueId, layer));
    //         layers = list1;
    //     }
    //     else{
    //         if(layer.key===undefined){
    //             layer.key = uuid();
    //         }
    //         var keys = [];
    //         for(var i=0;i<layers.length;i++){
    //             keys.push(layers[i].key);
    //         }
    //         var list2 = layers;
    //         if(keys.includes(layer.key)){
    //             return;
    //         }else{
    //             var uniqueId = uuid();
    //             list2.push(createNewCard(uniqueId, layer));            
    //         }
    //         setLayers(list2);
            
    //     }
    // }

    // function createNewCard(uniqueId, data){
    //     return <LayerCard key={uniqueId} id = {uniqueId} name={data[0]} colour = {data[1]} data = {data[2]} value = {false} handleChange={handleChange}/>;
    // }

    // function addLayers(list){
    //     for(var i=0;i<list.length;i++){
    //         addLayer(list[i]);
    //     }
    //     sendData(layers);
    // }

    // function removeLayers(){
    //     setLayers([]);
    //     sendData(layers);
    // }

    // function sendData(data){
    //     props.addLayers(data);
    // }

    // function handleChange(data){
    //     props.handleChange(data);
    // }
    var [layers, setLayers] = useState([]);
    const [_data, setData, clearData, removeItemFromData] = useData()

    function addLayer(layer){
        setLayers([...layers, layer]);
        setData(layer);
    }

    function getRandomColour(){
        var letters = '0123456789ABCDEF';
        var colour = '#';
        for (var i = 0; i < 6; i++) {
          colour += letters[Math.floor(Math.random() * 16)];
        }
        return colour;
    }
    
    return (
        <div>
            <div style={{border:"1px solid black", width:"100%", height:"100px"}}>
                <label> <a>Vann</a><button onClick={()=> addLayer({ id: uuid(), name:"vann", colour: getRandomColour, data: vann})}>Add layer</button></label><br/>
                <label> <a>Arealbruk</a><button onClick={()=> addLayer({ id: uuid(), name:"Arealbruk", colour: getRandomColour, data: arealbruk})}>Add layer</button></label>
               
            </div>
            
            {/* <button onClick={()=>setData({ id: uuid(), name:"vann", colour: "blue", data: vann})}>Add Layers</button> */}
            {/* <button onClick={()=> addLayer()}>Add layer</button> */}
            <button onClick={() => clearData()}> Remove layers</button>
            <button onClick={() => removeItemFromData()}> Remove vann</button>
            

            <ul>
                {layers.map((layer, i) => {
                    return(
                        <li id={i} key={i}>
                            <LayerCard key={layer.id} id = {layer.id} name = {layer.name} colour = {layer.colour} data = {layer.data} value = {false}/>
                        </li>
                    )
                })}
            </ul>
        </div>
        
    )
}

export default Sidebar;