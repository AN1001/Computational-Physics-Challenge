use wasm_bindgen::prelude::*;
use js_sys::Float64Array;
use std::f64::consts::PI;

extern crate console_error_panic_hook;

#[wasm_bindgen]
pub struct Trajectory {
    x_values: Float64Array,
    y_values: Float64Array,
    apogee_x: f64,
    max_y: f64,
}

#[wasm_bindgen]
impl Trajectory {
    pub fn x_values(&self) -> Float64Array {
        self.x_values.clone()
    }

    pub fn y_values(&self) -> Float64Array {
        self.y_values.clone()
    }

    pub fn apogee_x(&self) -> f64 {
        self.apogee_x
    }

    pub fn max_y(&self) -> f64 {
        self.max_y
    }
}

#[wasm_bindgen]
pub fn plot_trajectory(theta: f64, g: f64, u: f64, h: f64) -> Trajectory {
    let theta_rad = (theta * PI) / 180.0;

    let range = ((u * theta_rad.cos()) / g) *
            (u * theta_rad.sin() + ((u * theta_rad.sin()).powi(2) + 2.0 * g * h).sqrt());

    let num_points = 50;

    let x_values: Vec<f64> = (0..num_points)
        .map(|i| (i as f64 * range) / (num_points as f64 - 1.0))
        .collect();

    let y_values: Vec<f64> = x_values.iter()
        .map(|&x| h + x * theta_rad.tan() - (g * x.powi(2)) / (2.0 * u.powi(2) * theta_rad.cos().powi(2)))
        .collect();

    let (max_y, apogee_x) = y_values.iter().enumerate()
        .fold((f64::MIN, 0.0), |(max_y, apogee_x), (i, &y)| {
            if y > max_y {
                (y, x_values[i])
            } else {
                (max_y, apogee_x)
            }
        });

    Trajectory {
        x_values: Float64Array::from(x_values.as_slice()),
        y_values: Float64Array::from(y_values.as_slice()),
        apogee_x,
        max_y,
    }
}

#[wasm_bindgen]
pub fn calculate_launch_angles(X: f64, Y: f64, u: f64, G:f64) -> Result<js_sys::Array, JsValue> {

    let common_term = 1.0 - (2.0 * G * Y) / (u * u) - (G * G * X * X) / (u * u * u * u);

    if common_term < 0.0 {
        return Err(JsValue::from_str("No real solutions for the given parameters."));
    }

    let tan_theta1 = ((u * u) / (G * X)) * (1.0 + common_term.sqrt());
    let tan_theta2 = ((u * u) / (G * X)) * (1.0 - common_term.sqrt());

    let theta1 = tan_theta1.atan();
    let theta2 = tan_theta2.atan();

    let result = js_sys::Array::new();
    result.push(&JsValue::from(theta1));
    result.push(&JsValue::from(theta2));

    Ok(result)
}

use js_sys::Array;

#[wasm_bindgen]
pub fn optimum_theta(u: f64, g: f64, h: f64) -> Array {
    let theta_opt = (1.0 / (2.0 + (2.0 * g * h) / (u * u)).sqrt()).asin();

    let R_opt = ((u * theta_opt.cos()) / g) *
                (u * theta_opt.sin() + ((u * theta_opt.sin()).powi(2) + 2.0 * g * h).sqrt());

    let result = Array::new();
    result.push(&JsValue::from(theta_opt));
    result.push(&JsValue::from(R_opt));

    result
}

#[wasm_bindgen]
pub fn plot_target_trajectory(g: f64, X: f64, Y: f64, u: f64) -> Result<Array, JsValue> {
    let angles = calculate_launch_angles(X, Y, u, g);
    let u_min = (g * Y + g * (X * X + Y * Y).sqrt()).sqrt();

    let theta_high = angles.clone()?.get(0).as_f64().ok_or("Invalid angle value")?;
    let theta_low = angles.clone()?.get(1).as_f64().ok_or("Invalid angle value")?;

    let num_points = 350;
    let h = 0.0;
    let opt_values = optimum_theta(u, g, h);
    let opt_theta = opt_values.get(0).as_f64().ok_or("Invalid opt_theta value")?;
    let opt_range = opt_values.get(1).as_f64().ok_or("Invalid opt_range value")?;

    let opt_x_values: Vec<f64> = (0..num_points)
        .map(|i| (i as f64 * opt_range) / (num_points as f64 - 1.0))
        .collect();
        
    let opt_y_values: Vec<f64> = opt_x_values.iter()
        .map(|&x| h + x * opt_theta.tan() - (g * x.powi(2)) / (2.0 * u.powi(2) * opt_theta.cos().powi(2)))
        .collect();
        
    let y_values_min: Vec<f64> = opt_x_values.iter()
        .map(|&x| x * ((Y + (X * X + Y * Y).sqrt()) / X) - x * x * ((X * X + Y * Y).sqrt() / (X * X)))
        .filter(|&y| y > -1000.0)
        .collect();

    let y_values_low: Vec<f64> = opt_x_values.iter()
        .map(|&x| x * theta_low.tan() - (g / (2.0 * u * u)) * (1.0 + theta_low.tan() * theta_low.tan()) * x * x)
        .filter(|&y| y > -1000.0)
        .collect();

    let y_values_high: Vec<f64> = opt_x_values.iter()
        .map(|&x| x * theta_high.tan() - (g / (2.0 * u * u)) * (1.0 + theta_high.tan() * theta_high.tan()) * x * x)
        .filter(|&y| y > -1000.0)
        .collect();

    let y_values_bounding: Vec<f64> = opt_x_values.iter()
        .map(|&x| (u * u) / (2.0 * g) - (g / (2.0 * u * u)) * x * x)
        .filter(|&y| y > -1000.0)
        .collect();

    let mut y_values_min = y_values_min;
    let mut y_values_low = y_values_low;
    let mut y_values_high = y_values_high;
    let mut y_values_bounding = y_values_bounding;

    let result = Array::new();
    result.push(&Float64Array::from(opt_x_values.as_slice()));
    result.push(&Float64Array::from(y_values_min.as_slice()));
    result.push(&Float64Array::from(y_values_low.as_slice()));
    result.push(&Float64Array::from(y_values_high.as_slice()));
    result.push(&Float64Array::from(opt_y_values.as_slice()));
    result.push(&Float64Array::from(y_values_bounding.as_slice()));
    result.push(&JsValue::from_f64(X));
    result.push(&JsValue::from_f64(Y));

    Ok(result)
}
