import Graph from "./Graph";
import Modal from "./Modal";
const Line = {
  x: [1, 2, 3, 4],
  y: [9, 10, 11, 12],
  mode: "lines",
  name: "Trajectory",
  line: { color: "blue" },
};

const Traces = [Line];

function TaskSetA() {
  return (
    <div className="d-flex flex-column">
      <h1 className="mx-auto mt-3">Tasks 1-2</h1>
      <div className="mx-auto">
        <Graph title={"Test Graph"} traces={Traces}></Graph>
      </div>
      <div className="mx-auto">
        <Modal></Modal>
      </div>
    </div>
  );
}

export default TaskSetA;
