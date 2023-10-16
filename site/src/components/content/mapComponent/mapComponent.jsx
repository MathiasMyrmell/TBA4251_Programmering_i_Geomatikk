import React, {useEffect, useState, useCallback, useMemo} from "react";
//Components
import ChangeBaseMap from "./changeBaseMap/changeBaseMap";
import MapLayerButton from "./mapLayerButton/mapLayerButton";
import DisplayPosition from "./displayPosition/displayPosition";


//Contexts
import { useData } from "../../../contexts/DataContext";
import { useMap } from "../../../contexts/MapContext";


//Styles
import {MapContainerA, HomeButton, ButtonIcon, LatLongBox}from "../../muiElements/styles";
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import LayersIcon from '@mui/icons-material/Layers';
import "./mapComponent.css";


//Div
import { MapContainer, TileLayer, GeoJSON, ZoomControl} from 'react-leaflet';


// Map component
function MapComponent () {
    const [homePosition, setHomePosition] = useState([63.42295075466846, 10.373325347900392])
    const [show, setShow] = useState("none");
    const [map, setMap, baseMap, setBaseMap, data, _setData] = useMap();


    // Adding popup to geojson
    function onEachFeature(feature, layer){
        layer.on({click: _whenClick}); 
    }
    
    function _whenClick(e){
        // console.log(e.target.feature.Type)
        // console.log(e.target.feature.Shape_Area)
        let type = e.target.feature.properties.Type
        let area = Math.round(e.target.feature.properties.Shape_Area,2)
        let popupContent = "<b>"+type+"</b>"+"<br>"+area + " m2" 
        e.target.bindPopup(popupContent).openPopup();

        // console.log(e.target.feature.properties.Type)
        
        // console.log(e.target.feature.properties.Shape_Area)
        // e.target.bindPopup(e.target.feature.properties.OBJTYPE).openPopup();
    }

    // Mapstyle
    const mapStyle = {
        height: "100vh",
        width: "100vw",
        zIndex: "0",
    }

    const displayMap = useMemo(
        () => (
            <MapContainer 
                center={homePosition} 
                zoom={13} 
                scrollWheelZoom={false}
                ref={setMap}
            >
            <TileLayer
                url={baseMap} style = {{mapStyle}}
            />
            <ZoomControl position="bottomright" />
            <ul>
                {data.map((layer, i) => {
                    return(
                        (layer.value === true) ? (
                        <li id={i} key={i} >
                            <GeoJSON style={{color:layer.colour}} data={layer.data.features} onEachFeature={onEachFeature}/>
                        </li>) : null
                    )
                })}
            </ul>
        </MapContainer>
        ),[data, baseMap],
    )

    return (
        <MapContainerA id="MapContainer">
            {map ? <DisplayPosition style={{top:"0"}} /> : null}
            {displayMap}
            {map ? <MapLayerButton map={map} setShow={setShow} show={show} /> : null}
        
        </MapContainerA>
    )
}

export default MapComponent;