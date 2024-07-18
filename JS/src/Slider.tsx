import "./slider.css";
import useThrottle from "./throttler";

interface Props {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  title: string;
  vertical?: boolean;
  verticalHeight?: number;
}

function formatToDecimal(num: number) {
  if (num % 1 === 0) {
    // Check if the number is an integer
    return num + ".0"; // Convert to string and add ".0"
  }
  return num; // If it's already a decimal, convert to string
}

function Slider({ min, max, value, onChange, title, vertical }: Props) {
  const handleChange = useThrottle(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.target.value));
    },
    20
  ); // Adjust the delay as needed

  return (
    <div
      className="slider-main"
      style={vertical ? { transform: "rotate(90deg)", width: 1 } : {}}
    >
      <div
        className="slider-container"
        style={vertical ? { minWidth: 420, width: 420 } : {}}
      >
        <div className="slider-value">{title}</div>

        <div className="range-container">
          <input
            type="range"
            style={{ margin: 0, height: `${vertical ? "50" : ""}` }}
            min={min}
            max={max}
            value={value}
            className="slider"
            onChange={handleChange}
            step={0.1}
          />
        </div>

        <div className="slider-value" style={{ maxWidth: 30 }}>
          {formatToDecimal(value)}
        </div>
      </div>
    </div>
  );
}

export default Slider;
