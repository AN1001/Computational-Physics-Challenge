import Graph from "./Graph";
import Modal from "./Modal";
import Slider from "./Slider";
import MarkdownMathRenderer from "./md";

//calculations
//what is even happening here?
const R =
  ((10 * Math.cos(0.7)) / 9.8) *
  (10 * Math.sin(0.7) + Math.sqrt((10 * Math.sin(0.7)) ** 2 + 2 * 9.8 * 2));
const numPoints = 100;
const xPoints = Array.from(
  { length: numPoints },
  (_, i) => (i * R) / (numPoints - 1)
);
const yPoints = xPoints.map(
  (x) =>
    2 + x * Math.tan(0.7) - (9.8 * x ** 2) / (2 * 10 ** 2 * Math.cos(0.7) ** 2)
);
//end calculations

const Line2 = {
  x: xPoints,
  y: yPoints,
  mode: "lines",
  name: "with DP",
  line: { color: "green" },
};

const Traces = [Line2];

function TaskSetA() {
  const mathExpr = `$$1.4 \\times 10^{3} \\approx 1500$$`;
  const mathExpr2 = `$$1.5 \\times 10^{3} = 1500$$`;

  return (
    <div className="d-flex flex-column">
      <h1 className="mx-auto mt-3">Tasks 1-2</h1>
      <div className="mx-auto">
        <Graph title={"Test Graph"} traces={Traces}></Graph>
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
      <Slider min={10} max={100} startValue={50}></Slider>
    </div>
  );
}

export default TaskSetA;
