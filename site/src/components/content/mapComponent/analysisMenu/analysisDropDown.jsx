import * as React from 'react';
import { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import Grow from '@mui/material/Grow';


import { AnalysisButton, AnalysisDropDownContainer } from '../../../muiElements/styles';
import AnalysisContainer from "./analysis/analysisContainer";
import FeatureSelection from "./featureSelection/featureSelection";
import BufferAnalysis from "./bufferAnalysis/bufferAnalysis";
import IntersectAnalysis from "./intersectAnalysis/intersectAnalysis";
import UnionAnalysis from "./unionAnalysis/unionAnalysis";
import DifferenceAnalysis from "./differenceAnalysis/differenceAnalysis.jsx";


import { useData } from "../../../../contexts/DataContext";


import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function AnalysisDropDown(){
    const [anchorEl, setAnchorEl] = React.useState(null);   
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIcon(<ArrowDropDownIcon />);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setIcon(<ArrowDropUpIcon />);
    };
    const [data, setData,layer, setLayer, chosenFeatures, setChosenFeatures, analysis, setAnalysis] = useData()
    const [show, setShow] = useState("none");

    const [icon, setIcon] = useState(<ArrowDropUpIcon />);
    function displayAnalysisWindow(show){

        if(show == "featureSelection"){
          setAnalysis({name: "Feature Analysis", analysis: <FeatureSelection displayAnalysisWindow = {displayAnalysisWindow}/>});
          setShow("block");
        }else if(show == "bufferAnalysis"){
          setAnalysis({name: "Buffer Analysis", analysis: <BufferAnalysis  displayAnalysisWindow = {displayAnalysisWindow}/>});
          setShow("block");
        }else if(show == "intersectAnalysis"){
          setAnalysis({name: "Intersect Analysis", analysis: <IntersectAnalysis  displayAnalysisWindow = {displayAnalysisWindow}/>});
          setShow("block");
        }else if(show == "unionAnalysis"){
          setAnalysis({name: "Union Analysis", analysis: <UnionAnalysis  displayAnalysisWindow = {displayAnalysisWindow}/>});
          setShow("block");
        }else if(show == "differenceAnalysis"){
            setAnalysis({name: "Difference Analysis", analysis: <DifferenceAnalysis  displayAnalysisWindow = {displayAnalysisWindow}/>});
            setShow("block");
        }
        else if(show=="close"){
     
          setShow("none");
        }
        handleClose();
      }



    return (
        <>
        <AnalysisDropDownContainer>
            <AnalysisButton
                id="fade-button"
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {icon} Analysis
            </AnalysisButton>
            <Popper
                open={open}
                anchorEl={anchorEl}
                role={undefined}
                placement="top-start"
                transition
                disablePortal
            >
            {({ TransitionProps, placement }) => (
                <Grow
                {...TransitionProps}
                style={{
                    transformOrigin:
                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                }}
                >
                <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                    >
                        <MenuItem onClick={() => displayAnalysisWindow("featureSelection")}>Feature Selection</MenuItem>
                        <MenuItem onClick={() => displayAnalysisWindow("bufferAnalysis")}>Buffer Analysis</MenuItem>
                        <MenuItem onClick={() => displayAnalysisWindow("intersectAnalysis")}>Intersection Analysis</MenuItem>
                        <MenuItem onClick={() => displayAnalysisWindow("unionAnalysis")}>Union Analysis</MenuItem>
                        <MenuItem onClick={() => displayAnalysisWindow("differenceAnalysis")}>Difference Analysis</MenuItem>
                    </MenuList>
                    </ClickAwayListener>
                </Paper>
                </Grow>
            )}
        </Popper>

        </AnalysisDropDownContainer>
        <AnalysisContainer display = {show} name = {analysis.name} analysis ={analysis.analysis} displayAnalysisWindow = {displayAnalysisWindow}/>
        </>


    );
}

export default AnalysisDropDown;
