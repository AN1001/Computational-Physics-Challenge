import { useEffect, useState } from "react";
import Graph from "./Graph";
import Modal from "./Modal";
import Slider from "./Slider";
import MarkdownMathRenderer from "./md";
// @ts-ignore
import init, { plot_target_trajectory } from "cpc-graphs";

class Trace {
  x: number[];
  y: number[];
  mode: string;
  name: string;
  line: { color: string; dash: string };

  constructor(name: string, color: string) {
    this.x = [];
    this.y = [];
    this.mode = "lines";
    this.name = name;
    this.line = { color: color, dash: "" };
  }
}

const targetTemp = {
  x: [10],
  y: [10],
  mode: "markers",
  name: "Target",
  marker: { color: "yellowgreen", size: 10 },
};

function TaskSetB() {
  const mathExpr = `$$1.4 \\times 10^{3} \\approx 1500$$`;
  const mathExpr2 = `$$1.5 \\times 10^{3} = 1500$$`;

  const [low_ball_trajectory] = useState(new Trace("Low Ball", "green"));
  const [high_ball_trajectory] = useState(new Trace("High Ball", "blue"));
  const [min_speed_trajectory] = useState(new Trace("Min U", "orange"));
  const [optimal_range_trajectory] = useState(new Trace("Opt Range", "red"));
  const [bounding_trajectory] = useState(new Trace("Bounding", "purple"));
  const [target] = useState(targetTemp);

  bounding_trajectory.line.dash = "dot";

  const [GRAVITY, setGRAVITY] = useState(9.8);
  const [LAUNCH_SPEED, setLAUNCH_SPEED] = useState(100);
  const [X, setX] = useState(250);
  const [Y, setY] = useState(300);
  const [DISPLAYED_RANGE, setDISPLAYED_RANGE] = useState(900);

  async function fetchTrajectory() {
    await init();
    const trajectories: any[] = plot_target_trajectory(
      GRAVITY,
      X,
      Y,
      LAUNCH_SPEED
    );

    low_ball_trajectory.x = trajectories[0];
    low_ball_trajectory.y = trajectories[2];

    high_ball_trajectory.x = trajectories[0];
    high_ball_trajectory.y = trajectories[3];

    min_speed_trajectory.x = trajectories[0];
    min_speed_trajectory.y = trajectories[1];

    optimal_range_trajectory.x = trajectories[0];
    optimal_range_trajectory.y = trajectories[4];

    bounding_trajectory.x = trajectories[0];
    bounding_trajectory.y = trajectories[5];

    target.x[0] = X;
    target.y[0] = Y;
  }

  fetchTrajectory();
  useEffect(() => {
    fetchTrajectory();
  }, [GRAVITY, LAUNCH_SPEED, X, Y]);

  const Traces = [
    low_ball_trajectory,
    high_ball_trajectory,
    min_speed_trajectory,
    optimal_range_trajectory,
    bounding_trajectory,
    target,
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

      <h1 className="mx-auto mt-3">Task 3</h1>
      <div className="mx-auto d-flex">
        <Graph
          title={"Fixed Position Target Model"}
          traces={Traces}
          rangeX={DISPLAYED_RANGE}
          applyDP={false}
          displayPoints={isChecked}
        ></Graph>
        <div>
          <Slider
            min={5}
            max={2000}
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
        <Modal title="Task 3">
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
          max={300}
          value={Y}
          onChange={setY}
          title={"Point Y"}
        ></Slider>
        <Slider
          min={1}
          max={300}
          value={X}
          onChange={setX}
          title={"Point X"}
        ></Slider>
        <Slider
          min={10}
          max={100}
          value={LAUNCH_SPEED}
          onChange={setLAUNCH_SPEED}
          title={"Launch Speed"}
        ></Slider>
      </section>
    </div>
  );
}

export default TaskSetB;
