import React, { useState, useEffect, useCallback } from 'react';

//Contexts
import { useMap } from "../../../../contexts/MapContext";

//Styles
import { HomeButton, LatLongBox}from "../../../muiElements/styles";
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';

function DisplayPosition() {
    const [map] = useMap();

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