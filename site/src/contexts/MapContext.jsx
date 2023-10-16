import { createContext , useContext, useState} from "react";
import {useData} from "./DataContext";


const DataContext = createContext(undefined)

const MapContext = ({ children}) => {
    const [data, setData, layer, setLayer, clearData, updateData, showContainer, setShowContainer,backgroundContent, setBackgroundContent] = useData()

    const [map, setMap] = useState(null);
    const [baseMap, setBaseMap] = useState("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    





    const value = [map, setMap, baseMap, setBaseMap, data, setData]

    return (
        <DataContext.Provider value = {value}>
            {children}
        </DataContext.Provider>
    );
};

const useMap = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
      throw new Error('useData must be used within a DataProvider');
    }
    return context;
  };

export default useMap;
export {MapContext, useMap};

