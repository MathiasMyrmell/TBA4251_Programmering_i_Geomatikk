import React, {useEffect, useState, useCallback, useMemo} from "react";

import { MapContainer, TileLayer,GeoJSON, Popup} from 'react-leaflet';
import { useData } from "../../../contexts/DataContext";
import "./mapComponent.css";

import AnalysisMenu from "./analysisMenu/analysisMenu";
import {HomeButton, ButtonIcon}from "../../muiElements/styles";
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import LayersIcon from '@mui/icons-material/Layers';
import ChangeBaseMap from "./changeBaseMap/changeBaseMap";

function DisplayPosition({ map }) {
    const [position, setPosition] = useState(() => map.getCenter())
    const center = [63.42153656907081, 10.538810010949685]
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
            <p style={{fontSize: "13px",position: "fixed", top:"97vh", right:"100px", zIndex: "2"}}>
                lat: {position.lat}, lng: {position.lng}{' '}
            </p>
            <HomeButton style={{position:"fixed", top:"10vh", right:"0", zIndex: "2"}}>
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

function MapLayerButton(props){
    const onClick = useCallback(() => {
        props.setShow((show) => (show === "none" ? "block" : "none"))
    }, [props.map])


    return (
        <HomeButton style={{position:"fixed", top:"20vh", right:"0", zIndex: "2"}}>
                <ButtonIcon>
                    <LayersIcon 
                        style={{fontSize: "50px"}}
                        onClick={onClick}
                    />
                </ButtonIcon>
            </HomeButton>
    )
}



function MapComponent () {
    const [data, _setData] = useData()
    const [homePosition, setHomePosition] = useState([63.42153656907081, 10.538810010949685])
    const [map, setMap] = useState(null);
    const [baseMap, setBaseMap] = useState("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    const [show, setShow] = useState("none");


    // Adding popup to geojson
    function onEachFeature(feature, layer){
        layer.on({click: _whenClick}); 
    }
    
    function _whenClick(e){
        e.target.bindPopup(e.target.feature.properties.OBJTYPE).openPopup();
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
        <>
            {map ? <DisplayPosition map={map} /> : null}    
            {displayMap}
            {map ? <MapLayerButton map={map} setShow={setShow} show={show}/> : null}
            <AnalysisMenu id = "analysis"/>
            <ChangeBaseMap name = {"Change Basemap"} display = {show} setShow={setShow} setBaseMap = {setBaseMap}/>
        </>
    )
}

export default MapComponent;