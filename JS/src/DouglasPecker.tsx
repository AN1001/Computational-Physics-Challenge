function perpendicularDistance(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const num = Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1);
  const den = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
  return num / den;
}

function DouglasPeucker(
  xPoints: number[],
  yPoints: number[],
  epsilon: number
): [number[], number[]] {
  // Find the point with the maximum distance
  let d_max = 0;
  let index = 0;
  const end = xPoints.length - 1;

  for (let i = 1; i < end; i++) {
    const d = perpendicularDistance(
      xPoints[i],
      yPoints[i],
      xPoints[0],
      yPoints[0],
      xPoints[end],
      yPoints[end]
    );
    if (d > d_max) {
      index = i;
      d_max = d;
    }
  }

  let resultX: number[] = [];
  let resultY: number[] = [];

  // If max distance is greater than epsilon, recursively simplify
  if (d_max > epsilon) {
    // Recursive call
    let recResultsX1: number[];
    let recResultsY1: number[];
    let recResultsX2: number[];
    let recResultsY2: number[];
    [recResultsX1, recResultsY1] = DouglasPeucker(
      xPoints.slice(0, index + 1),
      yPoints.slice(0, index + 1),
      epsilon
    );
    [recResultsX2, recResultsY2] = DouglasPeucker(
      xPoints.slice(index, end + 1),
      yPoints.slice(index, end + 1),
      epsilon
    );

    // Build the result list
    resultX = recResultsX1
      .slice(0, recResultsX1.length - 1)
      .concat(recResultsX2);
    resultY = recResultsY1
      .slice(0, recResultsY1.length - 1)
      .concat(recResultsY2);
  } else {
    resultX = [xPoints[0], xPoints[end]];
    resultY = [yPoints[0], yPoints[end]];
  }

  // Return the result
  return [resultX, resultY];
}

export default DouglasPeucker;
