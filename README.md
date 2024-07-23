### Extension Ideas 

Maybe other planets or density of air, anything interesting. Game? Angry birds?

300-600 people participating?

Extension ideas:
  - Angry Birds thing
  - Variable air density/pressure and account for gravity changing with height
  - Spherical Planet projection
  - GUI/App for projections
  - Short Paper
  - Up an inclined plane with bounces <strong>(seems very hard)</strong>
  - Enter 2 countries and calculates trajectory needed for it to go from a to b and displays it on a 3d mini earth

```diff
@@ Possibly try using chatGPT to convert JS -> Rust to speed up the work? @@
```

```typescript
function plotTrajectory(theta: number, g: number, u:number, h:number, r:number) {
  //convert to rad
  theta = (parseFloat(sliders.theta.value) * Math.PI) / 180;

  //work out the range of the particle
  const R =
    ((u * Math.cos(theta)) / g) *
    (u * Math.sin(theta) + Math.sqrt((u * Math.sin(theta)) ** 2 + 2 * g * h));

  const numPoints = 50;
  //create an array of 50 (numPoints) x points evenly spaced from 0 to the range calculated
  const xValues = Array.from(
    { length: numPoints },
    (_, i) => (i * R) / (numPoints - 1)
  );

  //for every x point work out its y coord (just copy the forumula ig)
  const yValues = xValues.map(
    (x) =>
      h + x * Math.tan(theta) - (g * x ** 2) / (2 * u ** 2 * Math.cos(theta) ** 2)
  );

  //work out largest y value and the x value that it occurs at
  const maxY = Math.max(...yValues);
  const apogeeX = xValues[yValues.indexOf(maxY)];

  return [xValues, yValues, apogeeX, maxY]
```

```typescript
function calculateLaunchAngles(X: number, Y:number, u:number) {
  const g = 9.81; // acceleration due to gravity in m/s^2

  // Calculate the common term inside the square root
  const commonTerm =
    1 - (2 * g * Y) / (u * u) - (g * g * X * X) / (u * u * u * u);

  // Check if the common term is negative, in which case the solution is not real
  if (commonTerm < 0) {
    throw new Error("No real solutions for the given parameters.");
  }

  // Calculate both possible values for tan(theta)
  const tanTheta1 = ((u * u) / (g * X)) * (1 + Math.sqrt(commonTerm));
  const tanTheta2 = ((u * u) / (g * X)) * (1 - Math.sqrt(commonTerm));

  // Convert tan(theta) to theta in radians
  const theta1 = Math.atan(tanTheta1);
  const theta2 = Math.atan(tanTheta2);

  return [theta1, theta2];
}
```

```typescript
function optimumTheta(u:number, g:number, h:number, theta:number) {
  // Calculate the optimal angle for maximum range 🥇
  const theta_opt = Math.asin(1 / Math.sqrt(2 + (2 * g * h) / (u * u)));

  // Calculate the maximum range R_opt for the optimal angle (For later extensions)
  const R_opt =
    ((u * Math.cos(theta_opt)) / g) *
    (u * Math.sin(theta_opt) +
      Math.sqrt((u * Math.sin(theta_opt)) ** 2 + 2 * g * h));
  return [theta_opt, R_opt];
}
```

```typescript
function plotTargetTrajectory(g: number, X: number, Y: number, u: number) {

  //you made 'calculateLaunchAngles' earlier
  const angles = calculateLaunchAngles(X, Y, u);
  const uMin = Math.sqrt(g * Y + g * Math.sqrt(X * X + Y * Y)); // minimum launch speed

  const thetaHigh = angles[0];
  const thetaLow = angles[1];

  const numPoints = 50;
  h = 0;
  let optValues = optimimTheta(u, g, h, 0);
  optTheta = optValues[0];
  optRange = optValues[1];

  //once again a range of x values from 0 to Range
  const optxValues = Array.from(
    { length: numPoints },
    (_, i) => (i * optRange) / (numPoints - 1)
  );

  //the Y values of the optimim trajectory
  const optYValues = optxValues.map(
    (x) =>
      h +
      x * Math.tan(optTheta) -
      (g * x ** 2) / (2 * u ** 2 * Math.cos(optTheta) ** 2)
  );

  //the Y values of the minimum trajectory
  let yValuesMin = optxValues
    .map(
      (x) =>
        x * ((Y + Math.sqrt(X * X + Y * Y)) / X) -
        x * x * (Math.sqrt(X * X + Y * Y) / (X * X))
    )
    .filter((x) => x > -1);
  //the .filter above removes any negative values

  //the Y values of the lowest trajectory
  let yValuesLow = optxValues
    .map(
      (x) =>
        x * Math.tan(thetaLow) -
        (g / (2 * u * u)) *
          (1 + Math.tan(thetaLow) * Math.tan(thetaLow)) *
          x *
          x
    )
    .filter((x) => x > -1);

  //the Y values of the highest trajectory
  let yValuesHigh = optxValues
    .map(
      (x) =>
        x * Math.tan(thetaHigh) -
        (g / (2 * u * u)) *
          (1 + Math.tan(thetaHigh) * Math.tan(thetaHigh)) *
          x *
          x
    )
    .filter((x) => x > -1);

  //the Y values of the bounding trajectory
  let yValuesBounding = optxValues
    .map((x) => (u * u) / (2 * g) - (g / (2 * u * u)) * x * x)
    .filter((x) => x > -1);

  //adds zero to the end of the trajectories so they all look like they are touching the ground
  yValuesMin.push(0);
  yValuesHigh.push(0);
  yValuesLow.push(0);
  yValuesBounding.push(0);

  return [
    optxValues,
    yValuesMin,
    yValuesLow,
    yValuesHigh,
    optYValues,
    yValuesBounding,
    X,
    Y
  ]

}
```

Idk how but thats only half, I will try and copy your syntax and do the rest
