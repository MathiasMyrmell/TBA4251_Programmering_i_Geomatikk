import React, { createContext, useContext, useEffect, useState } from 'react';
import uniqBy from 'lodash/uniqBy';
import _ from 'lodash';

const DataContext = createContext(undefined);


const DataProvider = ({ children }) => {
  const [data, setDataRaw] = useState([]);
  const [layer, setLayer] = useState({id:"none", name:"none", colour:"none", data:"none", value:""});
  const [showContainer, setShowContainer] = useState("none");
  const [backgroundContent, setBackgroundContent] = useState(null);

  const setData = (item, i = null) => {
    if(i === null){
      item.colour = getRandomColour();
      // console.log(item.data);
      setDataRaw(data => uniqBy([...data, item], 'id'));
    }else{
      setDataRaw(data => uniqBy([...data.slice(0, i), item, ...data.slice(i + 1)], 'id'));
    }
  }

  // const setLayer = (item) => {
  //   setChosenLayer(item);
  // }

  const updateData = (newData) => {
    setDataRaw(newData)
  }

  const clearData = () => {
    setDataRaw([])
  }

  // const removeItemFromData = (id) => {
  //   //Remove layer from map
  //   setDataRaw(data.filter(item => item.id !== id))
  //   //Remove layercard from sidebar
  // }

  function getRandomColour(){
    var letters = '0123456789ABCDEF';
    var colour = '#';
    for (var i = 0; i < 6; i++) {
      colour += letters[Math.floor(Math.random() * 16)];
    }
    return colour;
  }
   
  
  const value = [data, setData, layer, setLayer, clearData, updateData, showContainer, setShowContainer,backgroundContent, setBackgroundContent];



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