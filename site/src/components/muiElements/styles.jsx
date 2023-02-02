import { Card, FormControl, styled } from "@mui/material";

export const LCard = styled(Card)({
    height: "70px",
    width: "95%",
    display: "grid",
    gridTemplateColumns: "60% 10% 10% 20%",
    padding: "auto",
    margin: "0",
});


export const ColourChanger = styled(FormControl)({
    width: "40px",
    height: "40px",
    margin: "auto",
    // "& .MuiFormControl-root": {
    //     margin: "0",
    // },
    // "& .MuiMenuItem-root": {
    //     backgroundColor: "white",
    //     color: "red",
    //     fontWeight: "bold",
    // },
    // "& .MuiButtoBase-root": {
    //     width: "50px",
    // },
    "& .MuiSvgIcon-root": {
        display: "none",
    },
    // "& .MuiSelect-select": {
    //     height: "50px",
    //     width: "50px",
    // },
    // "&. MuiInputBase-root": {
    //     width: "0",
    //     height: "0 !important",
    // },
});