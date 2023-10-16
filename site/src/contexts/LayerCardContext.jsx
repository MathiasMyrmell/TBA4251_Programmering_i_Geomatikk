import { createContext , useContext} from "react";
import {useData} from "./DataContext";

const DataContext = createContext(undefined)

const LayerCardContext = ({ children}) => {
    const [data, setData, layer, setLayer, clearData, updateData] = useData();
    //remove item from data
    function removeItemFromDataL(id){
        // let updatedData= data.filter(item => item.id !== id)
        updateData(data.filter(item => item.id !== id))
        // console.log("a", a)
        // setData(data.filter(item => item.id !== id))
    }

    //handleCheckboxChange
    function handleCheckboxChangeL(id) {
        let card = data.find(item => item.id === id);
        let index = data.findIndex(item => item.id === id);
        // removeItemFromData(id);
        card.value = !card.value;
        setData(card, index);
    }

    //handleColourChange
    const handleColourChangeL = (id, colour) => {
        let card = data.find(item => item.id === id);
        let index = data.findIndex(item => item.id === id);
        // removeItemFromData(id);
        card.colour = colour;
        setData(card, index);
    }

    //changeLayerName
    function changeLayerNameL(id, newName){
        let layer = data.find(item => item.id === id);
        layer.name = newName;
        setData(layer);
    }

    function getLayerName(id){
        let layer = data.find(item => item.id === id);
        let name = layer.name
        return name
    }


    const value = [removeItemFromDataL, handleCheckboxChangeL, handleColourChangeL, changeLayerNameL, getLayerName]

    return (
        <DataContext.Provider value = {value}>
            {children}
        </DataContext.Provider>
    );
};

const useLayer = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
      throw new Error('useData must be used within a DataProvider');
    }
    return context;
  };

export default useLayer;
export {LayerCardContext, useLayer};

