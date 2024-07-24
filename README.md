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
```Rust
use std::f64::consts::PI;

fn plot_trajectory(theta: f64, g: f64, u: f64, h: f64, r: f64) -> (Vec<f64>, Vec<f64>, f64, f64) {
    // Convert to radians
    let theta_rad = (theta * PI) / 180.0;

    // Work out the range of the particle
    let R = ((u * theta_rad.cos()) / g) * 
            (u * theta_rad.sin() + ((u * theta_rad.sin()).powi(2) + 2.0 * g * h).sqrt());

    let num_points = 50;
    // Create an array of 50 (numPoints) x points evenly spaced from 0 to the range calculated
    let x_values: Vec<f64> = (0..num_points)
        .map(|i| (i as f64 * R) / (num_points as f64 - 1.0))
        .collect();

    // For every x point work out its y coord
    let y_values: Vec<f64> = x_values.iter()
        .map(|&x| h + x * theta_rad.tan() - (g * x.powi(2)) / (2.0 * u.powi(2) * theta_rad.cos().powi(2)))
        .collect();

    // Work out largest y value and the x value that it occurs at
    let (max_y, apogee_x) = y_values.iter().enumerate()
        .fold((f64::MIN, 0.0), |(max_y, apogee_x), (i, &y)| {
            if y > max_y {
                (y, x_values[i])
            } else {
                (max_y, apogee_x)
            }
        });

    (x_values, y_values, apogee_x, max_y)
}

fn main() {
    let theta = 45.0;
    let g = 9.81;
    let u = 20.0;
    let h = 0.0;
    let r = 0.0;  // 'r' is not used in the original JavaScript code, so we'll ignore it

    let (x_values, y_values, apogee_x, max_y) = plot_trajectory(theta, g, u, h, r);

    println!("x_values: {:?}", x_values);
    println!("y_values: {:?}", y_values);
    println!("apogee_x: {}", apogee_x);
    println!("max_y: {}", max_y);
}

```



```Rust
use std::f64::consts::PI;

fn calculate_launch_angles(X: f64, Y: f64, u: f64) -> Result<(f64, f64), &'static str> {
    const G: f64 = 9.81; // acceleration due to gravity in m/s^2

    // Calculate the common term inside the square root
    let common_term = 1.0 - (2.0 * G * Y) / (u * u) - (G * G * X * X) / (u * u * u * u);

    // Check if the common term is negative, in which case the solution is not real
    if common_term < 0.0 {
        return Err("No real solutions for the given parameters.");
    }

    // Calculate both possible values for tan(theta)
    let tan_theta1 = ((u * u) / (G * X)) * (1.0 + common_term.sqrt());
    let tan_theta2 = ((u * u) / (G * X)) * (1.0 - common_term.sqrt());

    // Convert tan(theta) to theta in radians
    let theta1 = tan_theta1.atan();
    let theta2 = tan_theta2.atan();

    Ok((theta1, theta2))
}

fn main() {
    let X = 20.0;
    let Y = 10.0;
    let u = 30.0;

    match calculate_launch_angles(X, Y, u) {
        Ok((theta1, theta2)) => {
            println!("theta1: {} degrees", theta1 * 180.0 / PI);
            println!("theta2: {} degrees", theta2 * 180.0 / PI);
        }
        Err(e) => println!("Error: {}", e),
    }
}


```



```Typescript
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
```Rust

use std::f64::consts::PI;

fn calculate_launch_angles(X: f64, Y: f64, u: f64) -> Result<(f64, f64), &'static str> {
    const G: f64 = 9.81; // acceleration due to gravity in m/s^2

    // Calculate the common term inside the square root
    let common_term = 1.0 - (2.0 * G * Y) / (u * u) - (G * G * X * X) / (u * u * u * u);

    // Check if the common term is negative, in which case the solution is not real
    if common_term < 0.0 {
        return Err("No real solutions for the given parameters.");
    }

    // Calculate both possible values for tan(theta)
    let tan_theta1 = ((u * u) / (G * X)) * (1.0 + common_term.sqrt());
    let tan_theta2 = ((u * u) / (G * X)) * (1.0 - common_term.sqrt());

    // Convert tan(theta) to theta in radians
    let theta1 = tan_theta1.atan();
    let theta2 = tan_theta2.atan();

    Ok((theta1, theta2))
}

fn main() {
    let X = 20.0;
    let Y = 10.0;
    let u = 30.0;

    match calculate_launch_angles(X, Y, u) {
        Ok((theta1, theta2)) => {
            println!("theta1: {} radians ({} degrees)", theta1, theta1.to_degrees());
            println!("theta2: {} radians ({} degrees)", theta2, theta2.to_degrees());
        }
        Err(e) => println!("Error: {}", e),
    }
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
```Rust
use std::f64::consts::PI;

fn optimum_theta(u: f64, g: f64, h: f64) -> (f64, f64) {
    // Calculate the optimal angle for maximum range
    let theta_opt = (1.0 / (2.0 + (2.0 * g * h) / (u * u)).sqrt()).asin();

    // Calculate the maximum range R_opt for the optimal angle
    let R_opt = ((u * theta_opt.cos()) / g) *
                (u * theta_opt.sin() + ((u * theta_opt.sin()).powi(2) + 2.0 * g * h).sqrt());
    
    (theta_opt, R_opt)
}

fn main() {
    let u = 30.0; // Initial velocity in m/s
    let g = 9.81; // Acceleration due to gravity in m/s^2
    let h = 0.0;  // Initial height in meters

    let (theta_opt, R_opt) = optimum_theta(u, g, h);

    println!("theta_opt: {} radians ({} degrees)", theta_opt, theta_opt.to_degrees());
    println!("R_opt: {} meters", R_opt);
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
```Rust
use std::f64::consts::PI;

fn calculate_launch_angles(X: f64, Y: f64, u: f64) -> Result<(f64, f64), &'static str> {
    const G: f64 = 9.81;

    let common_term = 1.0 - (2.0 * G * Y) / (u * u) - (G * G * X * X) / (u * u * u * u);

    if common_term < 0.0 {
        return Err("No real solutions for the given parameters.");
    }

    let tan_theta1 = ((u * u) / (G * X)) * (1.0 + common_term.sqrt());
    let tan_theta2 = ((u * u) / (G * X)) * (1.0 - common_term.sqrt());

    let theta1 = tan_theta1.atan();
    let theta2 = tan_theta2.atan();

    Ok((theta1, theta2))
}

fn optimum_theta(u: f64, g: f64, h: f64) -> (f64, f64) {
    let theta_opt = (1.0 / (2.0 + (2.0 * g * h) / (u * u)).sqrt()).asin();
    let R_opt = ((u * theta_opt.cos()) / g) *
                (u * theta_opt.sin() + ((u * theta_opt.sin()).powi(2) + 2.0 * g * h).sqrt());
    (theta_opt, R_opt)
}

fn plot_target_trajectory(g: f64, X: f64, Y: f64, u: f64) -> Result<(Vec<f64>, Vec<f64>, Vec<f64>, Vec<f64>, Vec<f64>, Vec<f64>, f64, f64), &'static str> {
    let angles = calculate_launch_angles(X, Y, u)?;
    let u_min = (g * Y + g * (X * X + Y * Y).sqrt()).sqrt();

    let theta_high = angles.0;
    let theta_low = angles.1;

    let num_points = 50;
    let h = 0.0;
    let (opt_theta, opt_range) = optimum_theta(u, g, h);

    let opt_x_values: Vec<f64> = (0..num_points)
        .map(|i| (i as f64 * opt_range) / (num_points as f64 - 1.0))
        .collect();

    let opt_y_values: Vec<f64> = opt_x_values.iter()
        .map(|&x| h + x * opt_theta.tan() - (g * x.powi(2)) / (2.0 * u.powi(2) * opt_theta.cos().powi(2)))
        .collect();

    let y_values_min: Vec<f64> = opt_x_values.iter()
        .map(|&x| x * ((Y + (X * X + Y * Y).sqrt()) / X) - x * x * ((X * X + Y * Y).sqrt() / (X * X)))
        .filter(|&y| y > -1.0)
        .collect();

    let y_values_low: Vec<f64> = opt_x_values.iter()
        .map(|&x| x * theta_low.tan() - (g / (2.0 * u * u)) * (1.0 + theta_low.tan() * theta_low.tan()) * x * x)
        .filter(|&y| y > -1.0)
        .collect();

    let y_values_high: Vec<f64> = opt_x_values.iter()
        .map(|&x| x * theta_high.tan() - (g / (2.0 * u * u)) * (1.0 + theta_high.tan() * theta_high.tan()) * x * x)
        .filter(|&y| y > -1.0)
        .collect();

    let y_values_bounding: Vec<f64> = opt_x_values.iter()
        .map(|&x| (u * u) / (2.0 * g) - (g / (2.0 * u * u)) * x * x)
        .filter(|&y| y > -1.0)
        .collect();

    let mut y_values_min = y_values_min;
    let mut y_values_low = y_values_low;
    let mut y_values_high = y_values_high;
    let mut y_values_bounding = y_values_bounding;

    y_values_min.push(0.0);
    y_values_low.push(0.0);
    y_values_high.push(0.0);
    y_values_bounding.push(0.0);

    Ok((opt_x_values, y_values_min, y_values_low, y_values_high, opt_y_values, y_values_bounding, X, Y))
}

fn main() {
    let g = 9.81;
    let X = 20.0;
    let Y = 10.0;
    let u = 30.0;

    match plot_target_trajectory(g, X, Y, u) {
        Ok((opt_x_values, y_values_min, y_values_low, y_values_high, opt_y_values, y_values_bounding, X, Y)) => {
            println!("Optimal x values: {:?}", opt_x_values);
            println!("Y values (minimum trajectory): {:?}", y_values_min);
            println!("Y values (low trajectory): {:?}", y_values_low);
            println!("Y values (high trajectory): {:?}", y_values_high);
            println!("Y values (optimal trajectory): {:?}", opt_y_values);
            println!("Y values (bounding trajectory): {:?}", y_values_bounding);
            println!("Target coordinates: ({}, {})", X, Y);
        }
        Err(e) => println!("Error: {}", e),
    }
}

```


Idk how but thats only half, I will try and copy your syntax and do the rest
