import { React, useEffect} from 'react';
//Contexts
import { useAnalysis } from "../../../contexts/AnalysisContext";

//Styles
import { AnalysisBackground, AnalysisC, ButtonIcon, Headings} from "../../muiElements/styles";
import CloseIcon from '@mui/icons-material/Close';

function AnalysisContainer(){
    const [analysis, displayAnalysis, showAnalysis, setShowAnalysis] = useAnalysis();
    
    
    return(
        <AnalysisBackground style={{display: showAnalysis}}>
            <AnalysisC >
                <Headings>
                    <h1>{analysis === undefined ? "" : analysis.name}</h1>
                </Headings>
                <ButtonIcon
                    onClick={() => setShowAnalysis("none")}
                    style={{position: "fixed",right:"0", top: "0", margin: "10px"}}
                >
                    <CloseIcon style={{fontSize: "40px"}}/>
                </ButtonIcon>
                {analysis === undefined ? <></> : analysis.analysis}
            </AnalysisC>
        </AnalysisBackground>

    );
}

export default AnalysisContainer;