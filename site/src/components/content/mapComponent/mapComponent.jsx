import React, {useEffect, useState} from "react";

import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { useData } from "../../../contexts/DataContext";
import "./mapComponent.css";

import { v4 as uuid } from "uuid";
import AnalysisMenu from "./analysisMenu/analysisMenu";

function MapComponent () {
    const [data, _setData] = useData()

    const mapStyle = {
        height: "100vh",
        width: "100vw",
    }

    function buttonClick(){
        console.log("layers");
        
    }

    return (
        <>
            <MapContainer center={[63.42153656907081, 10.538810010949685]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" style = {{mapStyle}}
            />
            <ul>
                {data.map((layer, i) => {
                    return(
                        (layer.value === true) ? (
                        <li id={i} key={i} >
                            <GeoJSON style={{color:layer.colour}} data={layer.data.features} />
                        </li>) : null
                    )
                })}
            </ul>
            {/* <Marker position={[63.42153656907081, 10.538810010949685]}>
                <Popup onClick>
                    somethin cool
                </Popup>
            </Marker> */}
            </MapContainer>
            <AnalysisMenu id = "analysis"/>
        </>
    )
}

export default MapComponent;