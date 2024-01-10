import * as React from "react";
import { useState } from "react";

//Contexts
import { useData } from "../../contexts/DataContext";

//Styles
import {
  MenuItem,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  Grow,
  Box,
} from "@mui/material";
import {
  AnalysisButton,
  AnalysisDropDownContainer,
} from "../../styles/styles";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

//Div
import _ from "lodash";

function AnalysisMenu() {
  const [
    data,
    setData,
    removeData,
    analysis,
    prepareLayersForAnalysis,
    displayAnalysis,
    showAnalysis,
    setShowAnalysis,
    analyses,
    showAnalysisMenu,
    setShowAnalysisMenu,
    showCreateLayerMode,
    setShowCreateLayerMode,
  ] = useData();
  const [anchorEl, setAnchorEl] = useState(null);
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

  function displayAnalysisWindow(analysisName) {
    displayAnalysis(analysisName);
    handleClose();
  }

  function displayCreateLayer() {
    handleClose();
    setShowCreateLayerMode(true);
  }

  return (
    <>
      <AnalysisDropDownContainer>
        <AnalysisButton
          sx={{ display: showAnalysisMenu }}
          id="fade-button"
          aria-controls={open ? "fade-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Box>{icon} Analysis</Box>
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
                  placement === "bottom-start" ? "left top" : "left bottom",
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
                      return (
                        <MenuItem
                          id={i}
                          key={i}
                          onClick={() => displayAnalysisWindow(key)}
                        >
                          {analyses[key].name}
                        </MenuItem>
                      );
                    })}
                    <MenuItem
                      id={0}
                      key={0}
                      onClick={() => displayCreateLayer()}
                    >
                      Create Layer
                    </MenuItem>
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
