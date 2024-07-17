import Plot from "react-plotly.js";
import DouglasPeucker from "./DouglasPecker";

interface Props {
  title: string;
  traces: Trace[];
}

interface Line {
  dash?: string;
  color: string;
  size?: string;
  shape?: string;
}

interface Trace {
  x: number[];
  y: number[];
  mode: string;
  name: string;
  line: Line;
}

function Graph({ title, traces }: Props) {
  traces.forEach((trace) => {
    trace.line.shape = "spline";
    [trace.x, trace.y] = DouglasPeucker(trace.x, trace.y, 0.04);
    console.log(trace.x, trace.y);
  });

  return (
    <>
      <Plot
        data={traces}
        layout={{
          width: 1000,
          height: 500,
          title: title,
          xaxis: {
            linecolor: "lightgrey",
            linewidth: 2,
            mirror: true,
          },
          yaxis: {
            linecolor: "lightgrey",
            linewidth: 2,
            mirror: true,
          },
        }}
      />
    </>
  );
}

export default Graph;
