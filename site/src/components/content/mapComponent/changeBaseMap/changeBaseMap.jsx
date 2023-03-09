import React from "react";

import { AnalysisBackground, AnalysisC, DropDownMenu , ButtonIcon, Headings, MapLayerContainer, BaseMapContainer} from "../../../muiElements/styles";
import CloseIcon from '@mui/icons-material/Close';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import map1 from "./img/map1.png";
import map2 from "./img/map2.png";
import map3 from "./img/map3.png";
import map4 from "./img/map4.png";
import map5 from "./img/map5.png";
import map6 from "./img/map6.png";

function changeBaseMap(props){


    const tileLayers = [
        {id: "1", name: "OpenStreetMap", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", img: map1},
        {id: "2", name: "Stadia Maps", url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", img: map2},
        {id: "3", name: "Stadia Maps", url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png", img: map3},
        {id: "4", name: "MtbMap", url: "http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png", img: map4},
        {id: "5", name: "Esri", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", img: map5},
        {id: "6", name: "Esri", url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", img: map6},
   
    ];

    function closeWindow(){
        props.setShow("none");
    }
    
    function changeLayer(baseMap){
        props.setBaseMap(baseMap);
        closeWindow();
    }


    return(
        <AnalysisBackground style={{display: props.display}}>
            <AnalysisC >
                <Headings>
                    <h1>{props.name}</h1>
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
                <ButtonIcon
                    onClick={()=> changeLayer()}
                    style={{position: "fixed",right:"0", bottom: "0", margin: "10px"}}
                >
                    <NoteAddIcon style={{width: "50px", color: "black", fontSize: "40px"}}/>
                </ButtonIcon>
            </AnalysisC>
        </AnalysisBackground>
    )
}

export default changeBaseMap;