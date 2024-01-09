import {
  Button,
  MenuItem,
  Select,
  IconButton,
  Card,
  FormControl,
  styled,
  Switch,
  TextField,
  Box,
  Menu,
  FormHelperText,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";

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

////App component
export const AppContainer = styled(Box)({
    height: "100%",
    width: "100%",
    zIndex: "0",
    backgroundColor: theme.palette.primary.main,
});

export const MapContainerA = styled(Box)({
  height: "100%",
  width: "100%",
  zIndex: "1",
});

////Sidebar
//Sidebar toggler
export const SidebarToggler = styled(Button)({
  height: "50px",
  width: "50px",
  margin: "auto",

  position: "fixed",
  top: "0",
  left: "0",
  zIndex: "5",
  backgroundColor: theme.palette.primary.main,
  display: "none",

  "& .MuiButtonBase-root": {
    height: "50px",
    width: "50px",
    margin: "auto",
  },
  "& .MuiSvgIcon-root": {
    height: "50px",
    width: "50px",
    color: theme.palette.textColor.main,
    fontSize: "50px",
  },
  "& .MuiTouchRipple-child": {
    backgroundColor: theme.palette.textColor.main,
  },

  "@media (max-width: 700px)": {
    display: "block",
  },
});

//Sidebar container
export const SidebarContainer = styled(Box)({
  margin: "0",
  zIndex: "2",
  borderRight: "solid 2px",
  width: "calc(100%/4)",
  backgroundColor: theme.palette.primary.main,
  gridTemplateRows: "auto 1fr",
  borderColor: theme.palette.secondary.main,
  width: "100%",
});

//Sidebar element
export const SidebarElement = styled(Box)({
  width: "100%",
  padding: "5px 0 5px 5px",
  backgroundColor: theme.palette.primary.main,
  boxSizing: "border-box",
});

//File container
export const FileContainer = styled(Box)({
  maxHeight: "200px",
  width: "100%",
  margin: "auto",
  overflowY: "auto",
  transition: "opacity 200ms, display 200ms",
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.textColor.main,
    borderRadius: 2.5,
  },
});

//FileCard
export const FileCardContainer = styled(Card)({
  width: "calc(100%-9px)",
  margin: "5px 5px",
  border: "4px solid",
  borderColor: theme.palette.secondary.main,
  padding: "10px",
  display: "grid",
  gridTemplateColumns: "auto 40px",
  color: theme.palette.textColor.main,
  backgroundColor: theme.palette.third.main,
  "@media: (max-width: 200px)": {
    gridTemplateColumns: "auto",
  },
});

//Layer container
export const LayerContainer = styled(Box)({
  overflowY: "auto",
  overflowX: "none",
  margin: "0",
  padding: "0 0 5px 0",
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.textColor.main,
    borderRadius: 2.5,
  },
});

export const Colourchangercontainer = styled(Box)({
  width: "400px",
  margin: "0 0 0 10px",
  display: "grid",
  gridTemplateColumns: "350px 30px",
});

//ChangeNameContainer
export const ChangeNameContainer = styled(Box)({
  width: "500px",
  top: "0",
  height: "500px",
  display: "grid",
  gridTemplateColumns: "100px auto",
  margin: "0px 20px 0px 5px",
  position: "absolute",
  backgroundColor: theme.palette.fourth.main,
  zIndex: "100000",
});

//Headings
export const Headings = styled(Box)({
  height: "50px",
  color: theme.palette.textColor.main,
  margin: "0 0 0 0",
  display: "grid",
  gridTemplateColumns: "auto 75px",
  h1: {
    margin: "0px",
    fontSize: "30px",
  },
});

export const HeadingButton = styled(Button)({
  height: "40px",
  maxWidth: "40px",
  padding: "0px",
  alignSelf: "center",
  justifySelf: "center",
  "& .MuiButtonBase-root": {
    height: "40px",
    maxWidth: "40px",
    padding: "0px",
    alignSelf: "center",
    justifySelf: "center",
  },

  "& .MuiSvgIcon-root": {
    height: "40px",
    width: "40px ",
    color: theme.palette.textColor.main,
    fontSize: "40px",
  },
  "& .MuiTouchRipple-child": {
    backgroundColor: theme.palette.textColor.main,
  },
});

////MapComponent
// HomeButton
export const HomeButton = styled(Button)({
  position: "fixed",
  zIndex: "2",
  height: "60px",
  width: "60px",
  margin: "20px 10px",
  border: "1px solid black",
  borderRadius: "30px",
  color: theme.palette.textColor.main,

  backgroundColor: theme.palette.third.main,
  "&:hover": {
    backgroundColor: theme.palette.hover.main,
  },
});

//Lat Long box
export const LatLongBox = styled(Box)({
  fontSize: "13px",
  position: "fixed",
  top: "0",
  right: "0",
  zIndex: "2",
  display: "grid",
  gridTemplateColumns: "180px 180px",

  "@media (max-width: 410px)": {
    display: "none",
  },
});

//Add button for file card
export const AddButton = styled(IconButton)({
  width: "40px",
  color: theme.palette.textColor.main,
});

////LayerCard
export const LCard = styled(Card)({
  width: "calc(100%-18px)",
  border: "4px solid",
  margin: "10px 5px",
  padding: "5px 0px",
  display: "grid",
  gridTemplateColumns: "auto 145px",
  borderColor: theme.palette.secondary.main,
  borderRadius: "30px",
  backgroundColor: theme.palette.third.main,
  "@media (max-width: 1000px)": {
    gridTemplateColumns: "none",
    gridTemplateRows: "auto auto",
  },
});

//Name of layer
export const CardName = styled(TextField)({
  margin: "0 15px 0 15px",
  "& .MuiInputBase-root": {
    margin: "auto",
    fontWeight: "bold",
    color: theme.palette.textColor.main,
  },
});

//LayerCardButtons
export const LayerCardButtons = styled(Box)({
  width: "auto",
  display: "grid",
  paddingRight: "10px",
  gridTemplateColumns: "auto auto auto",
});

//Switch for visibility
export const ShowSwitch = styled(Switch)({
  margin: "auto",

  "& .MuiSwitch-switchBase": {
    margin: "auto",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: theme.palette.textColor.main,
  },
  "& .MuiSwitch-track": {},
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.textColor.main,
  },
});

//DropDownMenus
export const LCardDropDown = styled(Menu)({
  zIndex: "3",
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.third.main,
    color: theme.palette.textColor.main,
  },
});

////AnalysisMenu
export const AnalysisMenuContainer = styled(Card)({
  height: "70px",
  backgroundColor: "rgba(0, 0, 0, 0)",
  width: "calc(100%-352px)",
  position: "fixed",
  bottom: "0",
  right: "0",
  marginRight: "50px",
  zIndex: "1",
  display: "block",
});

//Analysis Button
export const AnalysisButton = styled(Button)({
  height: "50px",
  width: "150px",
  margin: "0px 20px",
  border: "4px solid ",
  borderColor: theme.palette.secondary.main,
  borderRadius: "20px",
  color: "black",
  backgroundColor: theme.palette.third.main,
  color: theme.palette.textColor.main,
  fontWeight: "bold",

  "&:hover": {
    backgroundColor: theme.palette.hover.main,
  },

  "& .MuiButtonBase-root": {
    color: theme.palette.textColor.main,
  },

  "& .MuiIconButton-root": {
    color: theme.palette.textColor.main,
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.textColor.main,
  },
  "& .MuiBox-root": {
    height: "24px",
    width: "100%",
    color: "white",
    display: "grid",
    gridTemplateColumns: "40px 75px",
    color: theme.palette.textColor.main,
  },
});

export const AnalysisDropDownContainer = styled(Box)({
  height: "70px",
  position: "fixed",
  bottom: "0",
  right: "50px",
  zIndex: "11",
  display: "block",

  "& .MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiPaper-root MuiMenu-paper MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation8 MuiPopover-paper css-1poimk-MuiPaper-root-MuiMenu-paper-MuiPaper-root-MuiPopover-paper":
    {
      width: "200px",
    },
});

//AnalysisWindow
export const AnalysisBackground = styled(Card)({
  height: "100%",
  width: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  position: "absolute",
  top: "0",
  right: "0",
  zIndex: "10",
});

export const AnalysisC = styled(Card)({
  width: "450px",
  padding: "20px",
  backgroundColor: theme.palette.third.main,
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: "11",
});

export const DropDownMenu = styled(FormControl)({
  width: "400px",
  margin: "0 0 10px 0",
  zIndex: "3",
  "& .MuiFormHelperText-root ": {
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
  zIndex: "30000",
  "& .MuiInputBase-root": {
    backgroundColor: "rgba(256, 256, 256, 0.6)",
    color: theme.palette.textColor.main,
  },
  "& .MuiFormHelperText-root ": {
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
});

////Change Map Layer
export const BaseMapContainer = styled(Card)({
  height: "100px",
  width: "100px",
  padding: "10px",
  margin: "10px",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  display: "inline-block",
  zIndex: "2",
});

////General components
export const ButtonIcon = styled(IconButton)({
  height: "40px",
  width: "40px",
  margin: "auto",
  "& .MuiSvgIcon-root": {
    color: theme.palette.textColor.main,
  },
});
