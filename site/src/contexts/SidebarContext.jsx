import { createContext , useContext} from "react";
import {useData} from "./DataContext";

const DataContext = createContext(undefined)

const SidebarContext = ({ children}) => {
    const [data, setData, layer, setLayer, bufferDistance, setBufferDistance, analysis, setAnalysis, clearData, updateData, removeItemFromData, handleCheckboxChange, handleColourChange, changeLayerName] = useData()

    
    const value = []

    return (
        <DataContext.Provider value = {value}>
            {children}
        </DataContext.Provider>
    );
};

const useSidebar = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
      throw new Error('useData must be used within a DataProvider');
    }
    return context;
  };

export default useSidebar;
export {SidebarContext, useSidebar};

