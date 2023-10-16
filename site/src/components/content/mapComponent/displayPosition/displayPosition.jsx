import React, { useState, useEffect, useCallback } from 'react';

import { MapContainer, TileLayer, GeoJSON, ZoomControl} from 'react-leaflet';
import {MapContainerA, HomeButton, ButtonIcon, LatLongBox}from "../../../muiElements/styles";
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import { useMap } from "../../../../contexts/MapContext";

function DisplayPosition() {
    const [map, setMap] = useMap();

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

export default DisplayPosition;