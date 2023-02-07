import React, {useState} from "react";
import { FileCardContainer, AddButton } from "../../../muiElements/styles";
import { useData } from "../../../../contexts/DataContext";
import { v4 as uuid } from "uuid";
import { Button, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

function FileCard(props){
    const [file, _setFile] = useState(props.file);
    const [fileName, _setFileName] = useState(props.fileName);
    const [_data, setData] = useData();

    return(
        <FileCardContainer>
            <h4 style={{margin:"auto 0", display:"inline"}}>{fileName}</h4>
            <AddButton style={{width: "40px"}} aria-label="add" size="small" color="primary" onClick={()=> setData({ id: uuid(), name:fileName, colour: "", data: file, value: true})}>
                <AddIcon />
            </AddButton>
        </FileCardContainer>
    )
}



export default FileCard;