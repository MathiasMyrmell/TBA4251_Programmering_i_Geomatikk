import React, { createContext, useContext, useState } from 'react';
import arealbruk from "../files/arealbruk.json";
import vann from "../files/vann.json";
import uniqBy from 'lodash/uniqBy';
const DataContext = createContext(undefined);

const DataProvider = ({ children }) => {
  const [data, setDataRaw] = useState([]);


  const setData = (item, i = null) => {
    if(i === null){
      setDataRaw(data => uniqBy([...data, item], 'id'));
    }else{
      setDataRaw(data => uniqBy([...data.slice(0, i), item, ...data.slice(i + 1)], 'id'));
    }
  }

  const clearData = () => {
    setDataRaw([])
  }

  const removeItemFromData = (id) => {
    //Remove layer from map
    setDataRaw(data.filter(item => item.id !== id))
    //Remove layercard from sidebar

  }

  const handleCheckboxChange = (id) => {
    let card = data.find(item => item.id === id);
    let index = data.findIndex(item => item.id === id);
    // removeItemFromData(id);
    card.value = !card.value;
    setData(card, index);
    // console.log(data);
    // console.log("checkbox changed");
  }

  const handleColourChange = (id, colour) => {
    let card = data.find(item => item.id === id);
    let index = data.findIndex(item => item.id === id);
    // removeItemFromData(id);
    card.colour = colour;
    setData(card, index);
    // console.log(data);
    // console.log("colour changed");
  }

  


  const value = [data, setData, clearData, removeItemFromData, handleCheckboxChange, handleColourChange];

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default useData;
export { DataProvider, useData };