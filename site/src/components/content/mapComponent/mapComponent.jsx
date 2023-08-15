import React, {useEffect, useState, useCallback, useMemo} from "react";

import { MapContainer, TileLayer, GeoJSON, ZoomControl} from 'react-leaflet';
import { useData } from "../../../contexts/DataContext";
import "./mapComponent.css";

import {MapContainerA, HomeButton, ButtonIcon, LatLongBox}from "../../muiElements/styles";
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import LayersIcon from '@mui/icons-material/Layers';
import ChangeBaseMap from "./changeBaseMap/changeBaseMap";
import AnalysisDropDown from "./analysisMenu/analysisDropDown";


// Button to set map view to standard position
function DisplayPosition({ map }) {
    const [position, setPosition] = useState(() => map.getCenter())
    const center = [63.42295075466846, 10.373325347900392]
    const zoom = 13
    const onClick = useCallback(() => {
        map.setView(center, zoom)
    }, [map])

    const onMove = useCallback(() => {
        setPosition(map.getCenter())
    }, [map])

    useEffect(() => {
        map.on('move', onMove)
        return () => {
        map.off('move', onMove)
        }
    }, [map, onMove])
    return (
        <>
            <LatLongBox>
                <div>lat: {position.lat},</div>
                <div>lng: {position.lng}{' '}</div>
            </LatLongBox>
            <HomeButton>
                <ButtonIcon>
                    <LocationOnSharpIcon 
                        style={{fontSize: "50px"}}
                        onClick={onClick}
                    />
                </ButtonIcon>
            </HomeButton>
        </>
    )
}

// Button for toggling map layers
function MapLayerButton(props){
    const onClick = useCallback(() => {
        props.setShow((show) => (show === "none" ? "block" : "none"))
    }, [props.map])


    return (
        <HomeButton style={{top:"80px"}}>
                <ButtonIcon>
                    <LayersIcon 
                        style={{fontSize: "50px"}}
                        onClick={onClick}
                    />
                </ButtonIcon>
            </HomeButton>
    )
}

// Map component
function MapComponent () {
    const [data, _setData] = useData()
    const [homePosition, setHomePosition] = useState([63.42295075466846, 10.373325347900392])
    const [map, setMap] = useState(null);
    const [baseMap, setBaseMap] = useState("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    const [show, setShow] = useState("none");


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
            {map ? <DisplayPosition map={map} style={{top:"0"}} /> : null}    
            {displayMap}
            {map ? <MapLayerButton map={map} setShow={setShow} show={show} /> : null}
            {/* <AnalysisMenu id = "analysis"/> */}
            <ChangeBaseMap name = {"Change Basemap"} display = {show} setShow={setShow} setBaseMap = {setBaseMap}/>
            <AnalysisDropDown id = "AnalysisDropDown"/>
        
        </MapContainerA>
    )
}

export default MapComponent;