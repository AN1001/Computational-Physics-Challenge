import Plot from "react-plotly.js";
import DouglasPeucker from "./DouglasPecker";

interface Props {
  title: string;
  traces: Trace[];
  rangeX: number;
  height?: number;
  width?: number;
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

function Graph({ title, traces, rangeX, height, width }: Props) {
  traces.forEach((trace) => {
    trace.line.shape = "spline";
    [trace.x, trace.y] = DouglasPeucker(trace.x, trace.y, 0.04);
  });

  return (
    <>
      <Plot
        data={traces}
        layout={{
          width: width ? width : 1000,
          height: height ? height : 500,
          title: title,
          xaxis: {
            linecolor: "lightgrey",
            linewidth: 2,
            mirror: true,
            range: [0, rangeX],
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
