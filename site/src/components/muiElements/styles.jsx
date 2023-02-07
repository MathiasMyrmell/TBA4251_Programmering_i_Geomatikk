import react, {useState} from "react";
import { Button, MenuItem, Select, IconButton, Chip, Card, FormControl, styled, Switch, TextField, Box, Menu, FormHelperText} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ThemeContext, {themes} from "../../contexts/theme";

let theme = createTheme({
    palette: {
        primary: {
            main: "#06113C",
        },
        secondary: {
            main: "#FF8C32",
        },
        third: {
            main: "#EEEEEE",
        },
        fourth: {
            main: "#DDDDDD",
        },
        textColor: {
            main: "#FF8C32",
        },
        error: {
            main: "#FF0000",
        },
        hover: {
            main: "#DDDDDD",
        },
    },
});

////Navbar
export const NavbarContainer = styled(Box)({
    height: "100%",
    width: "100%",
    backgroundColor: theme.palette.primary.main,

    "h1" : {
        margin: "0px",
        fontSize: "30px",
        color: theme.palette.textColor.main,
    },
});


////Content
//Content container
export const ContentContainer = styled(Box)({
    height: "100%",
    width: "100%",
    display: "grid",
    gridTemplateColumns: "300px auto",
});


////MapComponent
// HomeButton
export const HomeButton = styled(Button)({
    height: "60px",
    width: "60px",
    margin: "10px",
    border: "1px solid black",
    borderRadius: "30px",
    backgroundColor: theme.palette.third.main,
    "&:hover": {
        // backgroundColor: "rgba(220, 220, 220, 1)",
        backgroundColor: theme.palette.hover.main,
    },
});


////Sidebar
//Sidebar container
export const SidebarContainer = styled(Box)({
    height: "100%",
    width: "300px",
    backgroundColor: theme.palette.primary.main,
});

//File container
export const FileContainer = styled(Box)({
    height: "150px",
    width: "100%",
    margin: "auto",
    overflow: "scroll",
    backgroundColor: theme.palette.primary.main,
});

//Layer container
export const LayerContainer = styled(Box)({
    // height: "90vh",
    overflow: "scroll",
    margin: "5px 0 0 0",
    backgroundColor: theme.palette.primary.main,
});

//Headings
export const Headings = styled(Box) ({
    color: theme.palette.textColor.main,
    margin: "0 0 10px 0",
    "h1" : {
        margin: "0px",
        fontSize: "30px",
    },
});

//FileCard
export const FileCardContainer = styled(Card)({
    width: "256px",
    height: "20px",
    margin: "5px auto",
    border: "4px solid ",
    borderColor: theme.palette.secondary.main,
    padding: "10px 10px 10px 10px",
    display: "grid",
    gridTemplateColumns: " 216px 40px",
    alignContent: "center",
    justifyContent: "center",
    color: theme.palette.textColor.main,
    backgroundColor: theme.palette.third.main,
});

//Add button for file card
export const AddButton = styled(IconButton)({
    width: "40px",
    color: theme.palette.textColor.main,
});


////LayerCard
export const LCard = styled(Card)({
    // height: "70px",
    width: "278px",
    display: "grid",
    gridTemplateColumns: "auto 58px 40px 40px",
    // padding: "5px 0px",
    margin: "10px",
    border: "4px solid",
    borderColor: theme.palette.secondary.main,
    borderRadius: "30px",
    backgroundColor: theme.palette.third.main,
});

//Name of layer
export const CardName = styled(TextField)({
    margin: "0px 15px",
    "& .MuiInputBase-root": {
        margin: "auto",
        fontWeight: "bold",
        color: theme.palette.textColor.main,
    },
});

//Switch for visibility
export const ShowSwitch = styled(Switch)({
    margin: "auto",

    "& .MuiSwitch-switchBase": {
        margin: "auto",
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: theme.palette.textColor.main,
    },
    "& .MuiSwitch-track": {
    },
    "& .MuiSwitch-thumb": {
            backgroundColor: theme.palette.textColor.main,
        },
});

//DropDownMenus
export const LCardDropDown = styled(Menu)({
    "& .MuiPaper-root": {
        backgroundColor: theme.palette.third.main,
        color: theme.palette.textColor.main,
    },
});
            

////AnalysisMenu
export const AnalysisMenuContainer = styled(Card)({
    height: "100px",
    backgroundColor: "rgba(0, 0, 0, 0)",
    width: "100%",
    position: "fixed",
    bottom: "0",
    zIndex: "1", 

});

//Analysis Button
export const AnalysisButton = styled(Button)({
    height: "40px",
    // width: "200px",
    margin: "30px 20px",
    border: "4px solid ",
    borderColor: theme.palette.secondary.main,
    borderRadius: "20px",
    color: "black",
    backgroundColor: theme.palette.third.main,
    fontWeight: "bold",

    "&:hover": {
        backgroundColor: theme.palette.hover.main,
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
    zIndex: "10",
});

export const AnalysisC= styled(Card)({
    // height: "200px",
    width: "450px",
    padding: "20px",
    backgroundColor: theme.palette.third.main,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "3",

});

export const DropDownMenu = styled(FormControl)({
    width: "400px",
    margin: "0 0 10px 0",
    zIndex: "3",
    "& .MuiFormHelperText-root ":{
        color: theme.palette.error.main,
        height: "20px",
    },
});

export const DropDownField = styled(Select)({
    color: theme.palette.textColor.main,
    backgroundColor: "rgba(256, 256, 256, 0.6)",
});

export const InputField = styled(TextField)({
    width: "400px",
    margin: "0 0 15px 0",
    zIndex: "3",
    "& .MuiInputBase-root": {
        backgroundColor: "rgba(256, 256, 256, 0.6)",
        color: theme.palette.textColor.main,
    },
    "& .MuiFormHelperText-root ":{
        color: theme.palette.error.main,
        height: "20px",
    },

});

export const DropDownFieldError = styled(FormHelperText)({
    color: theme.palette.error.main,
    height: "20px",
});

export const DropDownItem = styled(MenuItem)({
    color: theme.palette.textColor.main,
    "&:hover": {
        backgroundColor: theme.palette.hover.main,
    },

});

//DropDownFeatureSelect
export const DropDownFeatureSelect = styled(Box)({
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    ////sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}

});



////General components
export const ButtonIcon = styled(IconButton)({
    height: "40px",
    width: "40px",
    margin: "auto",
    "& .MuiSvgIcon-root": {
        color: theme.palette.textColor.main,
    },
    // "& .MuiTouchRipple-root .MuiTouchRipple-child": {
    //     backgroundColor: "red",
    //     color: "red",
    //     borderRadius: "2px"
    // },
});