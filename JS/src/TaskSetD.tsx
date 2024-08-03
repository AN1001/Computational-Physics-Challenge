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

  const [xPoints, setXValues] = useState(new Float64Array());
  const [yPoints, setYValues] = useState(new Float64Array());
  const [apogeeX, setApogeeXValues] = useState(0);
  const [apogeeY, setApogeeYValues] = useState(0);

  const [GRAVITY, setGRAVITY] = useState(9.8);
  const [LAUNCH_SPEED, setLAUNCH_SPEED] = useState(10);
  const [LAUNCH_HEIGHT, setLAUNCH_HEIGHT] = useState(2);
  const [DISPLAYED_RANGE, setDISPLAYED_RANGE] = useState(50);

  async function fetchTrajectory() {
    await init();
    const trajectory = plot_rt_trajectory(GRAVITY, LAUNCH_SPEED);
    console.log(trajectory[0]);

    setXValues(trajectory[0]);
    setYValues(trajectory[1][0]);
    setApogeeXValues(trajectory[1][1]);
    setApogeeYValues(trajectory[1][2]);
  }

  useEffect(() => {
    fetchTrajectory();
  }, [GRAVITY, LAUNCH_SPEED, LAUNCH_HEIGHT]);

  const Line2 = {
    x: Array.from(xPoints),
    y: Array.from(yPoints),
    mode: "lines",
    name: "No Air Resistance",
    line: { color: "green" },
  };

  const apogeeTrace = {
    x: [apogeeX],
    y: [apogeeY],
    mode: "markers",
    name: "Apogee",
    marker: { color: "yellowgreen", size: 10 },
  };

  const Traces = [Line2, apogeeTrace];

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

      <h1 className="mx-auto mt-3">Tasks 5-7</h1>
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
            min={5}
            max={300}
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
