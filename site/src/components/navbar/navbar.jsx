import React, { useContext, useState } from "react";
import ThemeContext, {themes} from "../../contexts/theme";
import { NavbarContainer } from "../muiElements/styles";


function Navbar() {

    return (
        <>
        <NavbarContainer>
            <h1 >Navbar</h1>
        </NavbarContainer>
        </>
    )
}

export default Navbar;