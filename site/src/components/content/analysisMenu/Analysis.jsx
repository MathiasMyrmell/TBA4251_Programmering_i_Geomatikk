import AnalysisMenu from "./analysisMenu";
import AnalysisContainer from "./analysisContainer";

import { useAnalysis } from "../../../contexts/AnalysisContext";


function Analysis(){

    const [] = useAnalysis();

    return (
        <>
            <AnalysisMenu/>
            <AnalysisContainer/>
        </>     
    );
}

export default Analysis;