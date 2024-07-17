import "./slider.css";

interface Props {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

function Slider({ min, max, value, onChange }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
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
