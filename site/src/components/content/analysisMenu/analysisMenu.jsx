import * as React from 'react';
import { useState } from 'react';

//Contexts
import { useAnalysis } from "../../../contexts/AnalysisContext";

//Styles
import {MenuItem, Popper, Paper, ClickAwayListener, MenuList, Grow} from '@mui/material';
import { AnalysisButton, AnalysisDropDownContainer } from '../../muiElements/styles';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

//Div
import _ from 'lodash';


function AnalysisMenu(){
    const [analysis, displayAnalysis,showAnalysis, setShowAnalysis, analyses, prepareLayersForAnalysis, addAreaToFeature, showAnalysisMenu, setShowAnalysisMenu, showCreateLayerMode, setShowCreateLayerMode] = useAnalysis();
    const [anchorEl, setAnchorEl] = React.useState(null);   
    const open = Boolean(anchorEl);
    const [icon, setIcon] = useState(<ArrowDropUpIcon />);
    
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setIcon(<ArrowDropDownIcon />);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setIcon(<ArrowDropUpIcon />);
    };

    function displayAnalysisWindow(analysisName){
        displayAnalysis(analysisName)
        handleClose();
    };

    return (
        <>
            <AnalysisDropDownContainer >
                <AnalysisButton
                    sx = {{display: showAnalysisMenu}}
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
                                {_.keys(analyses).map((key, i) => {
                                    return(
                                        <MenuItem id={i} key={i} onClick={() => displayAnalysisWindow(key)}>{analyses[key].name}</MenuItem>
                                    ) 
                                })}
                            </MenuList>
                            </ClickAwayListener>
                        </Paper>
                        </Grow>
                    )}
                </Popper>
            </AnalysisDropDownContainer>
        </>
    );
}

export default AnalysisMenu;
