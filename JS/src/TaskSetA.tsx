import { useEffect, useState } from "react";
import Graph from "./Graph";
import Modal from "./Modal";
import Slider from "./Slider";
import MarkdownMathRenderer from "./md";
import init, { plot_trajectory } from "cpc-graphs";

function TaskSetA() {
  const mathExpr = `$$1.4 \\times 10^{3} \\approx 1500$$`;
  const mathExpr2 = `$$1.5 \\times 10^{3} = 1500$$`;

  const [xPoints, setXValues] = useState(new Float64Array());
  const [yPoints, setYValues] = useState(new Float64Array());
  const [apogeeX, setApogeeXValues] = useState();
  const [apogeeY, setApogeeYValues] = useState();

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

  return (
    <div className="d-flex flex-column">
      <h1 className="mx-auto mt-3">Tasks 1-2</h1>
      <div className="mx-auto d-flex">
        <Graph
          title={"No Air Resistance"}
          traces={Traces}
          rangeX={DISPLAYED_RANGE}
          applyDP={true}
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
