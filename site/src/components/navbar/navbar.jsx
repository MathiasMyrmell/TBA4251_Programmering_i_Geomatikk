import React, { useContext, useState } from "react";
import ThemeContext, {themes} from "../../contexts/theme";


function Navbar() {

    const [theme, setTheme] = useState(themes);
    return (
        <>
        <div>
            <h1 style={{color: theme.colors.error}}>Navbar</h1>
        </div>
        </>
    )
}

export default Navbar;