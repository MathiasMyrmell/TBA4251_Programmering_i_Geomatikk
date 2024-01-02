import React, {useEffect, useState, useCallback, useMemo} from "react";
//Components



//Contexts
import { useMap } from "../../../../contexts/MapContext";



//Styles
import { AnalysisBackground, AnalysisC, DropDownMenu , HomeButton, ButtonIcon, Headings, MapLayerContainer, BaseMapContainer} from "../../../muiElements/styles";
import LayersIcon from '@mui/icons-material/Layers';


//Div
import map1 from "./img/map1.png";
import map2 from "./img/map2.png";
import map3 from "./img/map3.png";
import map4 from "./img/map4.png";
import map5 from "./img/map5.png";
import map6 from "./img/map6.png";

import CloseIcon from '@mui/icons-material/Close';
import NoteAddIcon from '@mui/icons-material/NoteAdd';




function MapLayerButton(){
    // const onClick = useCallback(() => {
    //     props.setShow((show) => (show === "none" ? "block" : "none"))
    // }, [props.map])
    const [showChangeBaseMap, setShowChangeBaseMap] = useState("none");

    function openWindow(){
        setShowChangeBaseMap((show) => (show === "none" ? "block" : "none"))
    }

    const [map, setMap, baseMap, setBaseMap, data, setData, showMapLayerButton, setShowMapLayerButton, showDisplayPosition, setShowDisplayPosition] = useMap();


    // ChangeBaseMap
    const tileLayers = [
        {id: "1", name: "OpenStreetMap", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", img: map1},
        {id: "2", name: "Stadia Maps", url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", img: map2},
        {id: "3", name: "Stadia Maps", url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png", img: map3},
        {id: "4", name: "MtbMap", url: "http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png", img: map4},
        {id: "5", name: "Esri", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", img: map5},
        {id: "6", name: "Esri", url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", img: map6},
   
    ];

    // function closeWindow(){
    //     props.setShow("none");
    // }

    function closeWindow(){
        setShowChangeBaseMap("none");
    }
    
    function changeLayer(baseMap){
        setBaseMap(baseMap);
    }

    

    return (
        <>
            <HomeButton 
                sx={{
                    top:"80px",
                    right: "0",
                }}
                onClick={openWindow}
            >
                {/* <ButtonIcon>
                    <LayersIcon 
                        style={{fontSize: "50px"}}
                        onClick={openWindow}
                    />
                </ButtonIcon> */}
                <LayersIcon 
                        style={{fontSize: "50px"}}
                    />
            </HomeButton>

            <AnalysisC style={{display: showChangeBaseMap, zIndex: 10000}}>
                <Headings>
                    <h1>{"Change basemap"}</h1>
                </Headings>
                <ButtonIcon
                    onClick={() => closeWindow()}
                    style={{position: "fixed",right:"0", top: "0", margin: "10px"}}
                >
                    <CloseIcon style={{fontSize: "40px"}}/>
                </ButtonIcon>
                {tileLayers.map((layer) => (
                    <BaseMapContainer key={layer.id} onClick={()=> changeLayer(layer.url)}>
                        <img style={{width: "100px", height: "100px"}} src={layer.img}/>
                    </BaseMapContainer>
                    ))
                }                
            </AnalysisC>
        </>
    )
}

export default MapLayerButton;