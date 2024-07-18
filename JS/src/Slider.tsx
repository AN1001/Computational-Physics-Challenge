import "./slider.css";
import useThrottle from "./throttler";

interface Props {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  title: string;
}

function Slider({ min, max, value, onChange, title }: Props) {
  const handleChange = useThrottle(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.target.value));
    },
    20
  ); // Adjust the delay as needed

  return (
    <div className="slider-container">
      <div className="d-flex justify-content-between" style={{ width: "100%" }}>
        <div className="slider-value">{title}</div>
        <div className="slider-value">{value}</div>
      </div>

      <input
        type="range"
        style={{ margin: 0 }}
        min={min}
        max={max}
        value={value}
        className="slider"
        onChange={handleChange}
      />
    </div>
  );
}

export default Slider;
