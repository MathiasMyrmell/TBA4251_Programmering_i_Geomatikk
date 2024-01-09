import {createContext} from "react";
export const themes = {
    fontSizes: {
        small: "12px",
        medium: "14px",
        large: "16px",
        xlarge: "18px",
        xxlarge: "20px",
        xxxlarge: "22px",
        xxxxlarge: "24px",

    },
    colors: {
        primary: "#3f51b5",
        secondary: "#f50057",
        error: "#f44336",
        warning: "#ff9800",
        info: "#2196f3",
    },
};


const ThemeContext = createContext(themes);
export default ThemeContext;