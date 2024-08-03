import { useEffect, useState } from "react";
import Graph from "./Graph";
import Modal from "./Modal";
import Slider from "./Slider";
import MarkdownMathRenderer from "./md";
// @ts-ignore
import init, { plot_rt_trajectory } from "cpc-graphs";

function TaskSetA() {
  const mathExpr = `$$1.4 \\times 10^{3} \\approx 1500$$`;
  const mathExpr2 = `$$1.5 \\times 10^{3} = 1500$$`;

  const [xPoints1, setX1Values] = useState(new Float64Array());
  const [yPoints1, setY1Values] = useState(new Float64Array());
  const [xPoints2, setX2Values] = useState(new Float64Array());
  const [yPoints2, setY2Values] = useState(new Float64Array());
  const [xPoints3, setX3Values] = useState(new Float64Array());
  const [yPoints3, setY3Values] = useState(new Float64Array());
  const [xPoints4, setX4Values] = useState(new Float64Array());
  const [yPoints4, setY4Values] = useState(new Float64Array());
  const [xPoints5, setX5Values] = useState(new Float64Array());
  const [yPoints5, setY5Values] = useState(new Float64Array());
  const [xPoints6, setX6Values] = useState(new Float64Array());
  const [yPoints6, setY6Values] = useState(new Float64Array());

  const [apogeeX1, setApogeeX1Values] = useState(0);
  const [apogeeY1, setApogeeY1Values] = useState(0);
  const [apogeeX2, setApogeeX2Values] = useState(0);
  const [apogeeY2, setApogeeY2Values] = useState(0);
  const [apogeeX3, setApogeeX3Values] = useState(0);
  const [apogeeY3, setApogeeY3Values] = useState(0);

  const [apogeeX5, setApogeeX5Values] = useState(0);
  const [apogeeY5, setApogeeY5Values] = useState(0);
  const [apogeeX6, setApogeeX6Values] = useState(0);
  const [apogeeY6, setApogeeY6Values] = useState(0);

  const [GRAVITY, setGRAVITY] = useState(9.8);
  const [LAUNCH_SPEED, setLAUNCH_SPEED] = useState(10);
  const [LAUNCH_HEIGHT, setLAUNCH_HEIGHT] = useState(2);
  const [DISPLAYED_RANGE, setDISPLAYED_RANGE] = useState(3);

  function setValues(arr: Float64Array) {
    setX1Values(arr);
    setX2Values(arr);
    setX3Values(arr);
    setX4Values(arr);
    setX5Values(arr);
    setX6Values(arr);
  }
  async function fetchTrajectory() {
    await init();
    const trajectory = plot_rt_trajectory(
      GRAVITY,
      LAUNCH_SPEED,
      DISPLAYED_RANGE
    );

    setValues(trajectory[0]);
    setY1Values(trajectory[1][0]);
    setY2Values(trajectory[2][0]);
    setY3Values(trajectory[3][0]);
    setY4Values(trajectory[4][0]);
    setY5Values(trajectory[5][0]);
    setY6Values(trajectory[6][0]);

    setApogeeX1Values(trajectory[4][1]);
    setApogeeY1Values(trajectory[4][2]);
    setApogeeX2Values(trajectory[5][1]);
    setApogeeY2Values(trajectory[5][2]);
    setApogeeX3Values(trajectory[6][1]);
    setApogeeY3Values(trajectory[6][2]);

    setApogeeX5Values(trajectory[5][3]);
    setApogeeY5Values(trajectory[5][4]);
    setApogeeX6Values(trajectory[6][3]);
    setApogeeY6Values(trajectory[6][4]);
  }

  useEffect(() => {
    fetchTrajectory();
  }, [GRAVITY, LAUNCH_SPEED, LAUNCH_HEIGHT, DISPLAYED_RANGE]);

  const Line1 = {
    x: Array.from(xPoints1),
    y: Array.from(yPoints1),
    mode: "lines",
    name: "Range 30°",
    line: { color: "green" },
  };

  const Line2 = {
    x: Array.from(xPoints2),
    y: Array.from(yPoints2),
    mode: "lines",
    name: "Range 45°",
    line: { color: "pink" },
  };

  const Line3 = {
    x: Array.from(xPoints3),
    y: Array.from(yPoints3),
    mode: "lines",
    name: "Range 60°",
    line: { color: "blue" },
  };

  const Line4 = {
    x: Array.from(xPoints4),
    y: Array.from(yPoints4),
    mode: "lines",
    name: "Range 70.5°",
    line: { color: "indigo" },
  };

  const Line5 = {
    x: Array.from(xPoints5),
    y: Array.from(yPoints5),
    mode: "lines",
    name: "Range 78°",
    line: { color: "orange" },
  };

  const Line6 = {
    x: Array.from(xPoints6),
    y: Array.from(yPoints6),
    mode: "lines",
    name: "Range 85°",
    line: { color: "yellowgreen" },
  };

  const apogeeTrace1 = {
    x: [apogeeX1],
    y: [apogeeY1],
    mode: "markers",
    name: "Maximum",
    showlegend: false,
    marker: { color: "purple", size: 7 },
  };

  const apogeeTrace2 = {
    x: [apogeeX2],
    y: [apogeeY2],
    mode: "markers",
    name: "Maximum",
    showlegend: false,
    marker: { color: "purple", size: 7 },
  };

  const apogeeTrace3 = {
    x: [apogeeX3],
    y: [apogeeY3],
    mode: "markers",
    name: "Maximum",
    showlegend: false,
    marker: { color: "purple", size: 7 },
  };

  const apogeeTrace5 = {
    x: [apogeeX5],
    y: [apogeeY5],
    mode: "markers",
    name: "Minimum",
    showlegend: false,
    marker: { color: "black", size: 7 },
  };

  const apogeeTrace6 = {
    x: [apogeeX6],
    y: [apogeeY6],
    mode: "markers",
    name: "Minimum",
    showlegend: false,
    marker: { color: "black", size: 7 },
  };

  const Traces = [
    Line1,
    Line2,
    Line3,
    Line4,
    Line5,
    Line6,
    apogeeTrace1,
    apogeeTrace2,
    apogeeTrace3,
    apogeeTrace5,
    apogeeTrace6,
  ];

  const [isChecked, setIsChecked] = useState(false);
  function handleToggle() {
    setIsChecked(!isChecked);
  }

  return (
    <div className="d-flex flex-column">
      <div
        style={{ marginTop: 89, marginLeft: 12 }}
        className="d-flex flex-column position-absolute top-0 start-0"
      >
        <input
          type="checkbox"
          className="btn-check"
          id="btn-check-2-outlined"
          checked={isChecked}
          autoComplete="off"
          onChange={handleToggle}
        ></input>
        <label
          className="btn btn-outline-secondary"
          htmlFor="btn-check-2-outlined"
        >
          Show Points
        </label>
        <br></br>
      </div>

      <h1 className="mx-auto mt-3">Task 7</h1>
      <div className="mx-auto d-flex">
        <Graph
          title={"Range Against Time"}
          traces={Traces}
          rangeX={DISPLAYED_RANGE}
          applyDP={true}
          displayPoints={isChecked}
        ></Graph>
        <div>
          <Slider
            min={2}
            max={40}
            value={DISPLAYED_RANGE}
            onChange={setDISPLAYED_RANGE}
            title={"Range"}
            vertical={true}
          ></Slider>
        </div>
      </div>

      <div
        className="position-absolute top-0 end-0"
        style={{ marginTop: 89, marginRight: 12 }}
      >
        <Modal title="Tasks 1 and 2">
          <p>So we decided to use the approximation</p>
          <MarkdownMathRenderer mathExp={mathExpr} />
          <p>
            to save on time and resources, which was not that far from the real
            value of
          </p>
          <MarkdownMathRenderer mathExp={mathExpr2} />
          <p>Here we can see an example of a math problem:</p>
          <p>4 + 1 = 5</p>
        </Modal>
      </div>
      <section className="slider-holder d-flex flex-wrap">
        <Slider
          min={1}
          max={30}
          value={GRAVITY}
          onChange={setGRAVITY}
          title={"Gravity"}
        ></Slider>
        <Slider
          min={10}
          max={100}
          value={LAUNCH_SPEED}
          onChange={setLAUNCH_SPEED}
          title={"Launch Speed"}
        ></Slider>
        <Slider
          min={0}
          max={50}
          value={LAUNCH_HEIGHT}
          onChange={setLAUNCH_HEIGHT}
          title={"Launch Height"}
        ></Slider>
      </section>
    </div>
  );
}

export default TaskSetA;
