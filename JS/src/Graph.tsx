import Plot from "react-plotly.js";

interface Props {
  title: string;
  traces: Trace[];
  theta?: number;
  g?: number;
  u?: number;
  h?: number;
  r?: number;
  X?: number;
  Y?: number;
}

interface Line {
  dash?: string;
  color: string;
  size?: string;
}

interface Trace {
  x: number[];
  y: number[];
  mode: string;
  name: string;
  line: Line;
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function Graph({ title, traces, theta, g, u, h, r, X, Y }: Props) {
  console.log(title, theta, g, u, h, r, X, Y);
  if (theta) {
    theta = toRad(theta);
  }
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
