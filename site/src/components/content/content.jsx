import React, {useEffect, useState, useCallback} from "react";
import Sidebar from "./sidebar/sidebar";
import MapComponent from "./mapComponent/mapComponent";
import "./content.css";
import LayerCard from "./sidebar/layerCard/layerCard";
import { DataProvider } from "../../contexts/DataContext";
import {Container, Box, Button, IconButton} from '@mui/material';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import AnalysisMenu from "./mapComponent/analysisMenu/analysisMenu";
import ChangeBaseMap from "./mapComponent/changeBaseMap/changeBaseMap";



function Content(){
    var [layers, setLayers] = useState([]);
    
    function addLayers(data){
        data.map(e =>{
            layers.push(e.props);
        });
        console.log(layers);
    }
 
    function handleChange(data){
        // data = [id,value]
        var newList = [];
        for(var i=0;i<layers.length;i++){
            if(layers[i].id===data[0]){
                var uniqueId = layers[i].id;
                console.log(data[1]);
                var newLayer = <LayerCard key={uniqueId} id = {layers[i].id} name = {layers[i].name} colour = {layers[i].colour} data = {layers[i].data} value = {data[1]} handleChange={handleChange}/>;
                var newLayer = newLayer.props;
                newList.push(newLayer);
            }else{
                newList.push(layers[i]);
            }
        }
        layers = newList;
    }

    function toggleSideBar(){
        if(showSidebar == "none"){
            setShowSidebar("block");
            setSidebarWidth(400);
            setIcon(<ArrowLeftIcon/>);
        }else{
            setShowSidebar("none");
            setSidebarWidth(64);
            setIcon(<ArrowRightIcon/>);
        }

    }

    const [showSidebar, setShowSidebar] = useState("block");
    const [sidebarWidth, setSidebarWidth] = useState(400);
    const [icon, setIcon] = useState(<ArrowLeftIcon/>);


    const [dimensions, setDimensions] = React.useState({ 
        height: window.innerHeight,
        width: window.innerWidth
    })
    function debounce(fn, ms) {
        let timer
        return _ => {
          clearTimeout(timer)
          timer = setTimeout(_ => {
            timer = null
            fn.apply(this, arguments)
          }, ms)
        };
      }

    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }, 0)

        window.addEventListener('resize', debouncedHandleResize)

        return _ => {
            window.removeEventListener('resize', debouncedHandleResize)

        }
    })

    useEffect(() => {
        if(dimensions.width < 950){
            setShowSidebar("none");
            setSidebarWidth(64);
            setIcon(<ArrowRightIcon/>);
        }else{
            setShowSidebar("block");
            setSidebarWidth(364);
            setIcon(<ArrowLeftIcon/>);
        }
    }, [dimensions.width])


    const [baseMap, setBaseMap] = useState("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    const [show, setShow] = useState("none");

    return (
        <DataProvider>
            <MapComponent layers={layers} setShow ={setShow}/>
            <Container id="SidebarContainer"
                sx={{
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        width: sidebarWidth,
                        height: "100%",
                        padding: "0px !important",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        overflow: "hidden",
                        "@media (min-width: 1200px)": {
                            width: "400px",
                        },
                        "@media (max-width: 1200px)": {
                            width: "calc(100%/3)",
                        },
                        "@media (max-width: 700px)": {
                            width: "calc(950px/3)",
                    
                        },

                }}
            >
                <Sidebar addLayers={addLayers} handleChange={handleChange} display ={showSidebar}
                />
         
                <Box 
                    sx={{
                        width: "40px",
                        height: "56px",
                        zIndex: "10",
                        borderRadius: "0px",
                        border: "2px solid #FF8C32",
                        borderLeft: "none",
                        backgroundColor: "#06113C",

                    }}
                >
                    <IconButton  onClick={toggleSideBar}
                        sx={{
                            color: "#FF8C32",
                            padding: "8px 0px",
  
                            "& .MuiButtonBase-root": {
                                height: "40px",
                                maxWidth: "40px",
                                padding: "0px",
                                alignSelf: "center",
                                justifySelf: "center",
                            },
                            
                            "& .MuiSvgIcon-root": {
                                height: "40px",
                                width: "40px " ,
                                color: "#FF8C32",
                                fontSize: "40px",
                        
                            },
                            "& .MuiTouchRipple-child": {
                                backgroundColor: "#FF8C32",
                            },
                            
                        }}
                    >
                        {icon}
                    </IconButton>
                </Box>
            </Container>
            <AnalysisMenu id = "analysis"/>
            <ChangeBaseMap name = {"Change Basemap"} display = {show} setShow={setShow} setBaseMap = {setBaseMap}/>
        
        </DataProvider>
    );
}

export default Content;