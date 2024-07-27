import Plot from "react-plotly.js";
import DouglasPeucker from "./DouglasPecker";

interface Props {
  title: string;
  traces: Trace[];
  rangeX: number;
  height?: number;
  width?: number;
  applyDP: boolean;
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
  line?: Line;
}

function Graph({ title, traces, rangeX, height, width, applyDP }: Props) {
  traces.forEach((trace) => {
    if (trace.line) {
      trace.line.shape = "spline";
      if (applyDP) {
        [trace.x, trace.y] = DouglasPeucker(trace.x, trace.y, 0.01);
      }
    }
  });

  const rangeY = applyDP ? undefined : rangeX * 0.6;

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
            range: [0, rangeY],
          },
          showlegend: true,
          legend: {
            x: 1,
            xanchor: "right",
            y: 1,
          },
        }}
      />
    </>
  );
}

export default Graph;
