import React, { useState } from "react";
import "./slider.css";

interface Props {
  min: number;
  max: number;
  startValue: number;
}

function Slider({ min, max, startValue }: Props) {
  const [value, setValue] = useState(startValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        className="slider"
        onChange={handleChange}
      />
      <div className="slider-value">{value}</div>
    </div>
  );
}

export default Slider;
