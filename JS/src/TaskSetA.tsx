import { useEffect, useState } from "react";
import Graph from "./Graph";
import Modal from "./Modal";
import Slider from "./Slider";
import MarkdownMathRenderer from "./md";
// @ts-ignore
import init, { plot_trajectory } from "cpc-graphs";

function TaskSetA() {
  const mathExpr = `$$R = (u^2 \\times\\  sin(2θ)) / g$$`;
  const mathExpr2 = `$$h(t) = h_0 + u \\times\\ sin(θ) \\times\\ $$`;
  const mathExpr3 = `$$t - (1/2) \\times\\  g \\times\\  t^2$$`;

  const [xPoints, setXValues] = useState(new Float64Array());
  const [yPoints, setYValues] = useState(new Float64Array());
  const [apogeeX, setApogeeXValues] = useState(0);
  const [apogeeY, setApogeeYValues] = useState(0);

  const [GRAVITY, setGRAVITY] = useState(9.8);
  const [THETA, setTHETA] = useState(45);
  const [LAUNCH_SPEED, setLAUNCH_SPEED] = useState(10);
  const [LAUNCH_HEIGHT, setLAUNCH_HEIGHT] = useState(2);
  const [DISPLAYED_RANGE, setDISPLAYED_RANGE] = useState(50);

  async function fetchTrajectory() {
    await init();
    const trajectory = plot_trajectory(
      THETA,
      GRAVITY,
      LAUNCH_SPEED,
      LAUNCH_HEIGHT
    );

    setXValues(trajectory.x_values());
    setYValues(trajectory.y_values());
    setApogeeXValues(trajectory.apogee_x());
    setApogeeYValues(trajectory.max_y());
  }

  useEffect(() => {
    fetchTrajectory();
  }, [GRAVITY, THETA, LAUNCH_SPEED, LAUNCH_HEIGHT]);

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

      <h1 className="mx-auto mt-3">Tasks 1-2</h1>
      <div className="mx-auto d-flex">
        <Graph
          title={"No Air Resistance"}
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
          <p>
            The model is implemented with a fixed time increment Delta_t,
            iterating through time steps to calculate and plot x and y. The
            graph of the projectile's trajectory updates automatically when any
            input parameter is changed.
          </p>
          <MarkdownMathRenderer mathExp={mathExpr} />
          <p>
            Our Rust implementation, plot_trajectory, takes four input
            parameters: theta (angle of projection in degrees), g (acceleration
            due to gravity), u (initial velocity), and h (initial height). The
            function returns a Trajectory struct containing the x and y
            coordinates of the projectile's trajectory, as well as additional
            metadata.
          </p>
          <MarkdownMathRenderer mathExp={mathExpr2} />
          <MarkdownMathRenderer mathExp={mathExpr3} />
          <image></image>
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
      </section>
    </div>
  );
}

export default TaskSetA;
