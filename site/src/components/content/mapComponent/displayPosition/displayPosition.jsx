import React, { useState, useEffect, useCallback } from 'react';

import { MapContainer, TileLayer, GeoJSON, ZoomControl} from 'react-leaflet';
import {MapContainerA, HomeButton, ButtonIcon, LatLongBox}from "../../../muiElements/styles";
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import { useMap } from "../../../../contexts/MapContext";

function DisplayPosition() {
    // const [show, setShow] = useState(props.show)
    const [map, setMap, baseMap, setBaseMap, data, setData, showMapLayerButton, setShowMapLayerButton, showDisplayPosition, setShowDisplayPosition] = useMap();

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

    // useEffect (() => {
    //     console.log("show: ", props.show)
    //     setShow(props.show)
    // }, [props.show])
    return (
        <>
            <LatLongBox>
                <div>lat: {position.lat},</div>
                <div>lng: {position.lng}{' '}</div>
            </LatLongBox>
            <HomeButton sx = {{
                right: "0",
                top: "0",
                }}
                onClick={onClick}
            >
                <LocationOnSharpIcon 
                    style={{fontSize: "50px"}}
                />
            </HomeButton>
        </>
    )
}

export default DisplayPosition;