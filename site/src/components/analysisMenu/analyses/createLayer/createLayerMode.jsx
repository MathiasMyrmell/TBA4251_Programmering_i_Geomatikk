import React, { useEffect, useState } from "react";

//Contexts
import { useData } from "../../../../contexts/DataContext.jsx";

//Styles
import {
  Headings,
  HomeButton,
  ButtonIcon,
} from "../../../../styles/styles.jsx";
import { Card, Box, List, ListItem, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardOptionKeyIcon from "@mui/icons-material/KeyboardOptionKey";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//Div
import { v4 as uuid } from "uuid";
import * as turf from "@turf/turf";

function CreateLayerMode() {
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
    showContainer,
    setShowContainer,
    backgroundContent,
    setBackgroundContent,
    hideContentElements,
    setHideContentElements,
    markers,
    setMarkers,
  ] = useData();
  const [show, setShow] = useState("block");
  const [alertMessageOpen, setAlertMessageOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showList, setShowList] = useState(true);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  //Show this when create layer mode is active
  useEffect(() => {
    showCreateLayerMode ? setShow("block") : setShow("none");
  }, [showCreateLayerMode]);

  // Cresate layer from markers, and add it to data
  function createLayer() {
    if (markers.length < 3) {
      setAlertMessage(
        "To few markers to create layer. Minimum three markers needed."
      );
      setAlertType("error");
      setAlertMessageOpen(true);
      return;
    }
    //Create layer data
    let coordinates = [];
    for (let i = 0; i < markers.length; i++) {
      let lat = markers[i].position[1];
      let lng = markers[i].position[0];
      coordinates.push([lat, lng]);
    }
    //Complete polygon by adding first marker to end
    coordinates.push([markers[0].position[1], markers[0].position[0]]);

    //Create layer data
    let layerData = turf.featureCollection([turf.polygon([coordinates])]);

    //Create layer from markers
    let newLayer = {
      id: uuid(),
      name: "New layer",
      colour: "",
      data: layerData,
      value: true,
    };

    // Add new layer to data
    setData(newLayer);

    //Close create layer mode
    close();

    // Show success alert message
    setAlertMessage("Layer created successfully");
    setAlertType("success");
    setAlertMessageOpen(true);
  }

  // Close create layer mode
  function close() {
    setShowList(true);
    setMarkers([]);
    setShowCreateLayerMode(false);
  }

  // Close alert message
  const closeAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessageOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          display: show,
          width: "450px",
          padding: "20px",
          backgroundColor: "#EEEEEE",
          position: "fixed",
          top: "0",
          left: "50%",
          transform: "translate(-50%)",
          zIndex: "11",
        }}
      >
        <Headings>
          <h1>{"Create layer"}</h1>
        </Headings>
        <ButtonIcon
          onClick={() => setShowList(!showList)}
          style={{ position: "fixed", right: "0", top: "0", margin: "10px" }}
        >
          {showList ? (
            <ExpandLessIcon style={{ fontSize: "40px" }} />
          ) : (
            <ExpandMoreIcon style={{ fontSize: "40px" }} />
          )}
        </ButtonIcon>
        <Box
          sx={{
            display: showList ? "block" : "none",
          }}
        >
          <List>
            <ListItem>
              Hold down alt (
              <KeyboardOptionKeyIcon style={{ fontSize: "20px" }} /> on Mac) and
              click to add markers.
            </ListItem>
            <ListItem>To move a placed marker, click and drag it.</ListItem>
            <ListItem>
              To remove a marker, click on it and press{" "}
              <DeleteForeverIcon style={{ fontSize: "20px" }} />
            </ListItem>
            <ListItem>Minimum three markers needed to create a layer.</ListItem>
            <ListItem>
              Click on <NoteAddIcon style={{ fontSize: "20px" }} /> when
              finished creating layer.
            </ListItem>
            <ListItem>
              Press <CloseIcon style={{ fontSize: "20px" }} /> to cancel create
              layer mode.
            </ListItem>
          </List>
        </Box>
      </Card>
      <HomeButton
        sx={{
          display: show,
          right: "50px",
          bottom: "0",
        }}
        onClick={createLayer}
      >
        <NoteAddIcon style={{ fontSize: "50px" }} />
      </HomeButton>

      <HomeButton
        sx={{
          display: show,
          right: "120px",
          bottom: "0",
        }}
        onClick={close}
      >
        <CloseIcon style={{ fontSize: "50px" }} />
      </HomeButton>

      <Snackbar
        open={alertMessageOpen}
        autoHideDuration={5000}
        onClose={closeAlert}
      >
        <Alert onClose={closeAlert} severity={alertType} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CreateLayerMode;
