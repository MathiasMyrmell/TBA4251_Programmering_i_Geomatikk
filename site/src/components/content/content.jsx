import React, {useEffect, useState} from "react";
import Sidebar from "./sidebar/sidebar";
import MapComponent from "./mapComponent/mapComponent";
import "./content.css";
import LayerCard from "./sidebar/layerCard/layerCard";
import { Card, FormControl, styled, Box} from "@mui/material";
import { GeoJSON } from "react-leaflet";
import vann from "../../files/vann.json";
import { DataProvider } from "../../contexts/DataContext";

function Content(){
    var [layers, setLayers] = useState([]);
    
    function addLayers(data){
        data.map(e =>{
            layers.push(e.props);
        });
        console.log(layers);
    }
 
    function handleChange(data){
        // data = [id,value]
        var newList = [];
        for(var i=0;i<layers.length;i++){
            if(layers[i].id===data[0]){
                var uniqueId = layers[i].id;
                console.log(data[1]);
                var newLayer = <LayerCard key={uniqueId} id = {layers[i].id} name = {layers[i].name} colour = {layers[i].colour} data = {layers[i].data} value = {data[1]} handleChange={handleChange}/>;
                var newLayer = newLayer.props;
                newList.push(newLayer);
            }else{
                newList.push(layers[i]);
            }
        }
        layers = newList;
    }

    return (
        <div id="Content">
            <DataProvider>
                <div id="sidebar" className="appComponents"><Sidebar addLayers={addLayers} handleChange={handleChange}/></div>
                <div id="mapcomponent" className="appComponents" ><MapComponent layers={layers}/></div>
            </DataProvider>
        </div>
    );
}

export default Content;