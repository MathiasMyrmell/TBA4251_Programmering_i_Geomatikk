import { Button, IconButton, Card, FormControl, styled, Switch, TextField } from "@mui/material";


//Sidebar
export const FileContainer = styled(Card)({
    height: "150px",
    width: "100%",
    margin: "auto",
    overflow: "scroll",

});

export const LayerContainer = styled(Card)({
    // height: "100%",
    overflow: "scroll",
    margin: "5px 0 0 0",
});

//FileCard

export const FileCardContainer = styled(Card)({
    width: "256px",
    height: "20px",
    margin: "5px auto",
    border: "1px solid black",
    padding: "10px 10px 10px 10px",
    display: "grid",
    gridTemplateColumns: " 216px 40px",
    alignContent: "center",
    justifyContent: "center",
});


//LayerCard
export const LCard = styled(Card)({
    // height: "70px",
    width: "278px",
    display: "grid",
    gridTemplateColumns: "auto 58px 40px 40px",
    // padding: "5px 0px",
    margin: "10px",
    borderRadius: "30px",
});

export const CardName = styled(TextField)({
    margin: "0px 15px",
    "& .MuiInputBase-root": {
        margin: "auto",
        fontWeight: "bold",
    },

});


export const ShowSwitch = styled(Switch)({
    margin: "auto",
    // "& .MuiSwitch-switchBase": {
        //     margin: "auto",
        // },
        // "& .MuiSwitch-track": {
            //     backgroundColor: "red",
            // },
            // "& .MuiSwitch-thumb": {
                //     backgroundColor: "red",
                // },
});
            
      
export const ButtonIcon = styled(IconButton)({
    height: "40px",
    width: "40px",
    margin: "auto",
    


    // "& .MuiTouchRipple-root .MuiTouchRipple-child": {
    //     backgroundColor: "red",
    //     color: "red",
    //     borderRadius: "2px"
    // },
});


//AnalysisMenu
export const AnalysisMenuContainer = styled(Card)({
    height: "100px",
    backgroundColor: "rgba(0, 0, 0, 0)",
    width: "100%",
    position: "fixed",
    bottom: "0",
    zIndex: "1",

});

export const AnalysisButton = styled(Button)({
    height: "40px",
    // width: "200px",
    margin: "30px 20px",
    border: "1px solid black",
    borderRadius: "20px",
    color: "black",
    backgroundColor: "white",
    fontWeight: "bold",

    "&:hover": {
        backgroundColor: "rgba(220, 220, 220, 1)",
    },

});


//AnalysisWindow
export const AnalysisBackground = styled(Card)({
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "2",
});

export const AnalysisC= styled(Card)({
    height: "200px",
    width: "450px",
    padding: "20px",
    backgroundColor: "white",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "3",

});

export const DropDownMenu = styled(FormControl)({
    width: "400px",
    margin: "0 0 5px 0",
    zIndex: "3",
});