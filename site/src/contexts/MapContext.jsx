import { createContext, useContext, useState, useEffect } from "react";

import map1 from "./img/map1.png";
import map2 from "./img/map2.png";
import map3 from "./img/map3.png";
import map4 from "./img/map4.png";
import map5 from "./img/map5.png";
import map6 from "./img/map6.png";

const tileLayers = {
  1: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    img: map1,
  },
  2: {
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    img: map2,
  },
  3: {
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    img: map3,
  },
  4: {
    url: "http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png",
    img: map4,
  },
  5: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    img: map5,
  },
  6: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    img: map6,
  },
};

const DataContext = createContext(undefined);

const MapContext = ({ children }) => {
  const [map, setMap] = useState(null);
  const [baseMapId, setBaseMapId] = useState(1);
  const [baseMap, setBaseMap] = useState("");

  useEffect(() => {
    setBaseMap(tileLayers[baseMapId].url);
  }, [baseMapId]);

  function getBaseMaps() {
    let baseMaps = [];
    for (const [key, value] of Object.entries(tileLayers)) {
      baseMaps.push({ id: key, img: value.img });
    }
    return baseMaps;
  }

  const value = [map, setMap, baseMap, getBaseMaps, setBaseMapId];

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

const useMap = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export default useMap;
export { MapContext, useMap };
