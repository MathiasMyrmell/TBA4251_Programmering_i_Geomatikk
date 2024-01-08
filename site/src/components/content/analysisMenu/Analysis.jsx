import AnalysisMenu from "./analysisMenu";
import AnalysisContainer from "./analysisContainer";
import CreateLayerMode from "./analyses/createLayer/createLayerMode";


function Analysis(){
    
    return (
        <>
            <AnalysisMenu/>
            <AnalysisContainer/>
            <CreateLayerMode />
        </>     
    );
}

export default Analysis;