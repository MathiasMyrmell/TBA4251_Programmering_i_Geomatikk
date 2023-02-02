import React, { createContext, useContext, useState } from 'react';
import arealbruk from "../files/arealbruk.json";
import vann from "../files/vann.json";
import uniqBy from 'lodash/uniqBy';
const DataContext = createContext(undefined);

const DataProvider = ({ children }) => {
  const [data, setDataRaw] = useState([]);

  const setData = (item) => {
    setDataRaw(data => uniqBy([...data, item], 'id'))
  }

  const clearData = () => {
    setDataRaw([])
  }

  const removeItemFromData = (id) => {
    //Remove layer from map
    setDataRaw(data.filter(item => item.id !== id))
    //Remove layercard from sidebar

  }

  


  const value = [data, setData, clearData, removeItemFromData];

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