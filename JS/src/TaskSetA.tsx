import { useState } from "react";
import Graph from "./Graph";
import Modal from "./Modal";
import Slider from "./Slider";
import MarkdownMathRenderer from "./md";

//calculations
//what is even happening here?
function calc(u: number) {
  const R =
    ((u * Math.cos(0.7)) / 9.8) *
    (u * Math.sin(0.7) + Math.sqrt((u * Math.sin(0.7)) ** 2 + 2 * 9.8 * 2));
  const numPoints = 100;
  const xPoints = Array.from(
    { length: numPoints },
    (_, i) => (i * R) / (numPoints - 1)
  );

  const yPoints = xPoints.map(
    (x) =>
      2 + x * Math.tan(0.7) - (9.8 * x ** 2) / (2 * u ** 2 * Math.cos(0.7) ** 2)
  );

  return [xPoints, yPoints];
}

//end calculations

function TaskSetA() {
  const mathExpr = `$$1.4 \\times 10^{3} \\approx 1500$$`;
  const mathExpr2 = `$$1.5 \\times 10^{3} = 1500$$`;

  const [GRAVITY, setGRAVITY] = useState(9.8);
  const [THETA, setTHETA] = useState(50);
  const [LAUNCH_SPEED, setLAUNCH_SPEED] = useState(50);
  const [LAUNCH_HEIGHT, setLAUNCH_HEIGHT] = useState(50);
  const [DISPLAYED_RANGE, setDISPLAYED_RANGE] = useState(50);

  const [xPoints, yPoints] = calc(LAUNCH_SPEED);

  const Line2 = {
    x: xPoints,
    y: yPoints,
    mode: "lines",
    name: "with DP",
    line: { color: "green" },
  };

  const Traces = [Line2];

  return (
    <div className="d-flex flex-column">
      <h1 className="mx-auto mt-3">Tasks 1-2</h1>
      <div className="mx-auto d-flex">
        <Graph title={"No Air Resistance"} traces={Traces} rangeX={100}></Graph>
        <div>
          <Slider
            min={10}
            max={100}
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
          min={10}
          max={100}
          value={LAUNCH_HEIGHT}
          onChange={setLAUNCH_HEIGHT}
          title={"Launch Height"}
        ></Slider>
      </section>
    </div>
  );
}

export default TaskSetA;
