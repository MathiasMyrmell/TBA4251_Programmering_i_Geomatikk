import React, { useState}  from 'react';

//Components
import { SliderPicker } from 'react-color';

//Contexts
import { useLayer } from "../../../../../contexts/LayerCardContext";

function Colourchanger(props){
  const [removeItemFromDataL, handleCheckboxChangeL, handleColourChangeL] = useLayer();
  const [colour, setColour] = useState(props.colour);
  const handleChangeComplete = (color) => {
    setColour(color.hex);
    handleColourChangeL(props.id, color.hex);
  };

  return(
    <>
      <SliderPicker
        color = {colour}
        onChangeComplete = {handleChangeComplete}
      />
    </>
  )
}

export default Colourchanger;