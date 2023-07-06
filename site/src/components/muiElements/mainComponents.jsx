import { styled, Box} from "@mui/material";
import { createTheme} from "@mui/material/styles";

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


