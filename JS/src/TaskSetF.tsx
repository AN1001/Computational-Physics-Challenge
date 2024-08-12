import { useEffect, useState } from "react";
import Graph from "./Graph";
import Modal from "./Modal";
import Slider from "./Slider";
import MarkdownMathRenderer from "./md";
// @ts-ignore
import init, { calculate_projectile_trajectory } from "cpc-graphs";

function TaskSetC() {
  const mathExpr = `$$1.4 \\times 10^{3} \\approx 1500$$`;
  const mathExpr2 = `$$1.5 \\times 10^{3} = 1500$$`;

  const [xPoints, setXValues] = useState(new Float64Array());
  const [yPoints, setYValues] = useState(new Float64Array());
  const [xMaxPoints, setXMaxValues] = useState(new Float64Array());
  const [yMaxPoints, setYMaxValues] = useState(new Float64Array());

  const [GRAVITY, setGRAVITY] = useState(9.8);
  const [THETA, setTHETA] = useState(64);
  const [LAUNCH_SPEED, setLAUNCH_SPEED] = useState(30);
  const [LAUNCH_HEIGHT, setLAUNCH_HEIGHT] = useState(2);
  const [DISPLAYED_RANGE, setDISPLAYED_RANGE] = useState(100);
  const [AIR, setAIR] = useState(100);

  async function fetchTrajectory() {
    await init();
    const trajectory = calculate_projectile_trajectory(
      GRAVITY,
      AIR,
      LAUNCH_HEIGHT,
      LAUNCH_SPEED,
      THETA,
      AIR
    );

    setXValues(trajectory[0]);
    setYValues(trajectory[1]);

    setXMaxValues(trajectory[2]);
    setYMaxValues(trajectory[3]);

    console.log(trajectory[1], trajectory[3]);
    /*
        opt_x_values: Float64Array::from(opt_x_values.as_slice()),
        opt_y_values: Float64Array::from(opt_y_values.as_slice()),
        apogee_x,
        max_y,
        s_max,
        s
    */
  }

  useEffect(() => {
    fetchTrajectory();
  }, [GRAVITY, THETA, LAUNCH_SPEED, LAUNCH_HEIGHT, AIR]);

  const path = {
    x: Array.from(xPoints),
    y: Array.from(yPoints),
    mode: "lines",
    name: "No Air Resistance",
    line: { color: "green" },
  };

  const air_resistance = {
    x: Array.from(xMaxPoints),
    y: Array.from(yMaxPoints),
    mode: "lines",
    name: "Air Resistance",
    line: { color: "orange" },
  };

  const Traces = [path, air_resistance];

  const [isChecked, setIsChecked] = useState(false);

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
          onChange={() => setIsChecked(!isChecked)}
        ></input>
        <label
          className="btn btn-outline-secondary"
          htmlFor="btn-check-2-outlined"
        >
          Show Points
        </label>
        <br></br>
      </div>

      <h1 className="mx-auto mt-3">Task 9</h1>
      <div className="mx-auto d-flex">
        <Graph
          title={"Air Resistance"}
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
        <Modal title="Task 4">
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
          min={1}
          max={89}
          value={THETA}
          onChange={setTHETA}
          title={"Launch Angle"}
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
        <Slider
          min={10}
          max={30}
          value={AIR}
          onChange={setAIR}
          title={"Air Resistance C"}
        ></Slider>
        <Slider
          min={0}
          max={50}
          value={20}
          onChange={() => {}}
          title={"Mass"}
        ></Slider>
      </section>
    </div>
  );
}

export default TaskSetC;
