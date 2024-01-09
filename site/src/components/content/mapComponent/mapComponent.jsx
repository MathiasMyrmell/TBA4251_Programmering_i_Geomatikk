import React, { useState, useMemo} from "react";

//Components
import MapLayerButton from "./mapLayerButton/mapLayerButton";
import DisplayPosition from "./displayPosition/displayPosition";

//Contexts
import { useData } from "../../../contexts/DataContext";
import { useMap } from "../../../contexts/MapContext";

//Styles
import {MapContainerA, ButtonIcon}from "../../muiElements/styles";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import "./mapComponent.css";

//Div
import { MapContainer, TileLayer, GeoJSON, ZoomControl, Marker, Popup, useMapEvents} from 'react-leaflet';
import * as turf from '@turf/turf'
import { v4 as uuid } from "uuid";
import _ from "lodash";

// Map component
function MapComponent () {
    const [homePosition, setHomePosition] = useState([63.42295075466846, 10.373325347900392])
    const [map, setMap, baseMap, _setBaseMap] = useMap();
    const [data, setData, removeData, analysis, prepareLayersForAnalysis, displayAnalysis,showAnalysis, setShowAnalysis, analyses, showAnalysisMenu, setShowAnalysisMenu, showCreateLayerMode, setShowCreateLayerMode, showContainer, setShowContainer,backgroundContent, setBackgroundContent, hideContentElements, setHideContentElements, markers, setMarkers] = useData();

    // Adding popup to geojson
    function onEachFeature(feature, layer){
        layer.on({click: _whenClick}); 
    }
    
    function _whenClick(e){
        let type = e.target.feature.properties.Type
        let area = Math.round(e.target.feature.properties.Shape_Area,2)
        let popupContent = "<b>"+type+"</b>"+"<br>"+area + " m2" 
        e.target.bindPopup(popupContent).openPopup();
    }

    // Mapstyle
    const mapStyle = {
        height: "100vh",
        width: "100vw",
        zIndex: "0",
    }

    function AddPopUp(){
        const popUpAdder = useMapEvents({
            click(e) {
                if(e.originalEvent.altKey){
                    addNewMarker([e.latlng.lat,e.latlng.lng])
                }
            },
        });
        return null
    }

    function updateMarkers(newMarkers){
        setMarkers(newMarkers)
    }

    function addNewMarker(position){
        let marker = {id: uuid(), position: position,}
        updateMarkers([...markers, marker])
    }

    function removeMarker(marker){
        updateMarkers(_.without(markers, marker))
    }

    function updateMarkerPosition(marker){
        let index = markers.findIndex((obj => obj.id === marker.target.options.id));
        updateMarkers([...markers.slice(0, index), {id: marker.target.options.id, position: [marker.target._latlng.lat, marker.target._latlng.lng]}, ...markers.slice(index + 1)])
    }


    function ShowNewCreateLayer(){
        var polygon = turf.polygon([]);
        if(markers.length > 2){
            let polygonCoordinates = []
            for(let i = 0; i < markers.length; i++){
                let position = markers[i].position
                polygonCoordinates.push([position[1], position[0]])
            }
            polygonCoordinates.push([markers[0].position[1], markers[0].position[0]])
            polygon.geometry.coordinates.push(polygonCoordinates)
        }
        let fC = turf.featureCollection([polygon])
        let newLayer = {id : uuid(), name: "test", colour: "red", data: fC, value: true}
        const eventHandlers = useMemo(
            () => ({
              dragend(event) {
                updateMarkerPosition(event)
              },
            }),
            [],
        )
        return(
            <>
                <GeoJSON style={{color:newLayer.colour}} data={newLayer.data.features} onEachFeature={onEachFeature}/>
                <ul>
                    {markers.map((marker) => {
                        return(
                            <li id = {marker.id} key={marker.id}>
                                <Marker 
                                    position={[marker.position[0], marker.position[1]]} 
                                    draggable ={true}
                                    eventHandlers={eventHandlers}
                                    id = {marker.id}
                                > 
                                    <Popup>
                                        Remove
                                        <ButtonIcon
                                            onClick={() => removeMarker(marker)}
                                        >
                                            <DeleteForeverIcon/>
                                        </ButtonIcon>

                                    </Popup>
                                </Marker>
                            </li>
                        )
                    })}

                </ul>
            </>

        )
    }

    const displayMap = useMemo(
        () => (
            <MapContainer 
                center={homePosition} 
                zoom={13} 
                scrollWheelZoom={true}
                ref={setMap}
            >
                {showCreateLayerMode ? <AddPopUp /> : null}
                <ShowNewCreateLayer />
                
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
        ),[data, baseMap, markers, showCreateLayerMode],
    )
    
    return (
        <MapContainerA id="MapContainer" >
            {map && !showCreateLayerMode ? <DisplayPosition sx={{top:"0"}}/> : null}
            {displayMap}
            {map && !showCreateLayerMode ? <MapLayerButton/> : null}
        </MapContainerA>
    )
}

export default MapComponent;



