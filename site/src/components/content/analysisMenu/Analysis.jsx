import AnalysisMenu from "./analysisMenu";
import AnalysisContainer from "./analysisContainer";

import { useAnalysis } from "../../../contexts/AnalysisContext";
import CreateLayerMode from "./analyses/createLayer/createLayerMode";


function Analysis(){
    
    const [analysis, displayAnalysis,showAnalysis, setShowAnalysis, analyses, prepareLayersForAnalysis, addAreaToFeature, showAnalysisMenu, setShowAnalysisMenu,showCreateLayerMode, setShowCreateLayerMode] = useAnalysis();
    
    return (
        <>
            <AnalysisMenu/>
            <AnalysisContainer/>
            <CreateLayerMode />
        </>     
    );
}

export default Analysis;