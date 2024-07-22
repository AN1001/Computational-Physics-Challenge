import { useEffect, useState } from "react";
import Graph from "./Graph";
import Modal from "./Modal";
import Slider from "./Slider";
import MarkdownMathRenderer from "./md";
import init, { add } from "cpc-graphs";

//calculations
//what is even happening here?
function calculatePoints(
  inital_speed: number,
  gravity: number,
  theta: number,
  height: number
) {
  theta = theta * (Math.PI / 180); // convert to rad

  //Uses range equation to find range
  const Range =
    ((inital_speed * Math.cos(theta)) / gravity) *
    (inital_speed * Math.sin(theta) +
      Math.sqrt((inital_speed * Math.sin(theta)) ** 2 + 2 * gravity * height));

  const num_points = 100;
  const xPoints = Array.from(
    { length: num_points },
    (_, index) => (index * Range) / (num_points - 1)
  );

  const yPoints = xPoints.map(
    (x) =>
      //For every x point, find the Y coord
      height +
      x * Math.tan(theta) -
      (gravity * x ** 2) / (2 * inital_speed ** 2 * Math.cos(theta) ** 2)
  );

  return [xPoints, yPoints];
}

//end calculations

function TaskSetA() {
  const [ans, setAns] = useState(0);
  useEffect(() => {
    init().then(() => {
      setAns(add(4, 1));
    });
  }, []);

  const mathExpr = `$$1.4 \\times 10^{3} \\approx 1500$$`;
  const mathExpr2 = `$$1.5 \\times 10^{3} = 1500$$`;

  const [GRAVITY, setGRAVITY] = useState(9.8);
  const [THETA, setTHETA] = useState(45);
  const [LAUNCH_SPEED, setLAUNCH_SPEED] = useState(10);
  const [LAUNCH_HEIGHT, setLAUNCH_HEIGHT] = useState(2);
  const [DISPLAYED_RANGE, setDISPLAYED_RANGE] = useState(50);

  const [xPoints, yPoints] = calculatePoints(
    LAUNCH_SPEED,
    GRAVITY,
    THETA,
    LAUNCH_HEIGHT
  );

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
        <Graph
          title={"No Air Resistance"}
          traces={Traces}
          rangeX={DISPLAYED_RANGE}
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
          <p>4 + 1 = {ans}</p>
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
