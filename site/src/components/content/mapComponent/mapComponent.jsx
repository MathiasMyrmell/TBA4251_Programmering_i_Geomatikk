import React, {useEffect, useState} from "react";

import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { useData } from "../../../contexts/DataContext";
import "./mapComponent.css";

import { v4 as uuid } from "uuid";

function MapComponent (props) {
    // const [layers, setLayers] = useState(props.layers);
    const [data, _setData] = useData()

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

    function buttonClick(){
        console.log("layers");
        
    }


    return (
        <>
            <MapContainer center={[63.42153656907081, 10.538810010949685]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" style = {{mapStyle}}
            />
            {/* <ul>
                <li>
                    <GeoJSON style={{color:"red"}} data={vann.features} />
                </li>
                <li>
                    <GeoJSON style = {{color:"green"}} data={arealbruk.features} onEachLayer/>
                </li>
            </ul> */}
            

            <ul>
                {data.map((layer, i) => {
                    return(
                        <li id={i} key={i} style={{display:"false"}}>
                            <GeoJSON style={{color:layer.colour}} data={layer.data.features} />
                        </li>)
                    }
                )}
            </ul>
            


            {/* <Marker position={[63.42153656907081, 10.538810010949685]}>
                <Popup onClick>
                    somethin cool
                </Popup>
            </Marker> */}
            </MapContainer>
            <button onClick={buttonClick}>log layers</button>
        </>
    )
}

export default MapComponent;