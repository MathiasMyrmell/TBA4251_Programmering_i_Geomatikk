import React, {useState} from "react";

import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import "./mapComponent.css";
import arealbruk from "./../../files/arealbruk.json";
import vann from "./../../files/vann.json";

function MapComponent () {
    // const componentDidMount = () =>  {
    //     console.log("did mount");
    // }
    // componentDidMount();

    const mapStyle = {
        height: "100vh",
        width: "100vw",

    }
    
    
    var vannStyle = {
        fillColor: "green",
        weight: 1,
    }

    const onEachLayer = (areal, layer ) => {
        const arealNavn = areal.properties.ADMIN;
        layer.bindPopup(arealNavn);
    }

    // const layers = () =>  {
    //     const a = arealbruk.features.geometry;
    //     console.log(a);
    // }

    // layers();

    
    
    return (
        <>
            <MapContainer center={[63.42153656907081, 10.538810010949685]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" style = {{mapStyle}}
            />
            <GeoJSON style = {{color:"green"}} data={arealbruk.features} onEachLayer/>
            <GeoJSON style={{color:"red"}} data={vann.features} />
            <Marker position={[63.42153656907081, 10.538810010949685]}>
                <Popup >
                    somethin cool
                </Popup>
            </Marker>
            </MapContainer>
        </>
    )
}

export default MapComponent;