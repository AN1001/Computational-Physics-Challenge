use wasm_bindgen::prelude::*;
use js_sys::Float64Array;
use std::f64::consts::PI;
use js_sys::Array;

extern crate console_error_panic_hook;

#[wasm_bindgen]
pub struct Trajectory {
    x_values: Float64Array,
    y_values: Float64Array,
    opt_x_values: Float64Array,
    opt_y_values: Float64Array,
    apogee_x: f64,
    max_y: f64,
    s_max: f64,
    s:f64
}

#[wasm_bindgen]
pub fn optimum_theta(u: f64, g: f64, h: f64) -> Array {
    let theta_opt = (1.0 / (2.0 + (2.0 * g * h) / (u * u)).sqrt()).asin();

    let r_opt = ((u * theta_opt.cos()) / g) *
                (u * theta_opt.sin() + ((u * theta_opt.sin()).powi(2) + 2.0 * g * h).sqrt());

    let result = Array::new();
    result.push(&JsValue::from(theta_opt));
    result.push(&JsValue::from(r_opt));

    result
}

#[wasm_bindgen]
impl Trajectory {
    pub fn x_values(&self) -> Float64Array {
        self.x_values.clone()
    }

    pub fn y_values(&self) -> Float64Array {
        self.y_values.clone()
    }

    pub fn opt_x_values(&self) -> Float64Array {
        self.opt_x_values.clone()
    }

    pub fn opt_y_values(&self) -> Float64Array {
        self.opt_y_values.clone()
    }

    pub fn apogee_x(&self) -> f64 {
        self.apogee_x
    }

    pub fn max_y(&self) -> f64 {
        self.max_y
    }

    pub fn s_max(&self) -> f64 {
        self.s_max
    }
    
    pub fn s(&self) -> f64 {
        self.s
    }
}

fn dist_travelled(u: f64, theta: f64, g: f64, h: f64) -> f64 {
    fn z_func(z: f64) -> f64 {
        0.5 * (z.abs().sqrt().ln() + z) + 0.5 * z * (1.0 + z * z).sqrt()
    }

    let sin_theta = theta.sin();
    let cos_theta = theta.cos();
    let tan_theta = theta.tan();

    let r = ((u * u) / g) * (sin_theta * cos_theta + cos_theta * (sin_theta * sin_theta + (2.0 * g * h) / (u * u)).sqrt());

    let a = (u * u) / (g * (1.0 + tan_theta * tan_theta));
    let b = tan_theta;
    let c = tan_theta - (g * r * (1.0 + tan_theta * tan_theta)) / (u * u);

    a * (z_func(b) - z_func(c))
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

    let opt_values = optimum_theta(u, g, h);
    let opt_theta = opt_values.get(0).as_f64();
    let opt_range = opt_values.get(1).as_f64();

    let opt_x_values: Vec<f64> = (0..num_points)
        .map(|i| (i as f64 * opt_range.unwrap_or_default()) / (num_points as f64 - 1.0))
        .collect();

    let opt_y_values: Vec<f64> = opt_x_values.iter()
        .map(|&x| h + x * opt_theta.expect("REASON").tan() - (g * x.powi(2)) / (2.0 * u.powi(2) * opt_theta.expect("REASON").cos().powi(2)))
        .collect();

    let s_max = (dist_travelled(u, opt_theta.expect("REASON"), g, h) * 100.0).round() / 100.0;
    let s = (dist_travelled(u, theta_rad, g, h) * 100.0).round() / 100.0;

    Trajectory {
        x_values: Float64Array::from(x_values.as_slice()),
        y_values: Float64Array::from(y_values.as_slice()),
        opt_x_values: Float64Array::from(opt_x_values.as_slice()),
        opt_y_values: Float64Array::from(opt_y_values.as_slice()),
        apogee_x,
        max_y,
        s_max,
        s
    }
}

#[wasm_bindgen]
pub fn calculate_launch_angles(x: f64, y: f64, u: f64, g:f64) -> Result<js_sys::Array, JsValue> {
    let common_term = 1.0 - (2.0 * g * y) / (u * u) - (g * g * x * x) / (u * u * u * u);

    if common_term < 0.0 {
        return Err(JsValue::from_str("No real solutions for the given parameters."));
    }

    let tan_theta1 = ((u * u) / (g * x)) * (1.0 + common_term.sqrt());
    let tan_theta2 = ((u * u) / (g * x)) * (1.0 - common_term.sqrt());

    let theta1 = tan_theta1.atan();
    let theta2 = tan_theta2.atan();

    let result = js_sys::Array::new();
    result.push(&JsValue::from(theta1));
    result.push(&JsValue::from(theta2));

    Ok(result)
}

#[wasm_bindgen]
pub fn plot_target_trajectory(g: f64, x1: f64, y1: f64, u: f64) -> Result<Array, JsValue> {
    let angles = calculate_launch_angles(x1, y1, u, g);

    let theta_high = angles.clone()?.get(0).as_f64().ok_or("Invalid angle value")?;
    let theta_low = angles.clone()?.get(1).as_f64().ok_or("Invalid angle value")?;

    let num_points = 150;
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
        .map(|&x| x * ((y1 + (x1 * x1 + y1 * y1).sqrt()) / x1) - x * x * ((x1 * x1 + y1 * y1).sqrt() / (x1 * x1)))
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

    let y_values_min = y_values_min;
    let y_values_low = y_values_low;
    let y_values_high = y_values_high;
    let y_values_bounding = y_values_bounding;

    let result = Array::new();
    result.push(&Float64Array::from(opt_x_values.as_slice()));
    result.push(&Float64Array::from(y_values_min.as_slice()));
    result.push(&Float64Array::from(y_values_low.as_slice()));
    result.push(&Float64Array::from(y_values_high.as_slice()));
    result.push(&Float64Array::from(opt_y_values.as_slice()));
    result.push(&Float64Array::from(y_values_bounding.as_slice()));
    result.push(&JsValue::from_f64(x1));
    result.push(&JsValue::from_f64(y1));

    Ok(result)
}

#[wasm_bindgen]
pub fn plot_rt_trajectory(g: f64, u: f64, t: f64) -> Result<Array, JsValue> {
    const ANGLES: [f64; 6] = [30.0, 45.0, 60.0, 70.55, 78.0, 85.0];
    let result = Array::new();

    let num_points = 250;
    let t_flight: f64 = t;

    let t_values: Vec<f64> = (0..num_points)
        .map(|i| (i as f64 * t_flight) / (num_points as f64 - 1.0))
        .collect();

    result.push(&Float64Array::from(t_values.as_slice()));

    for (index, &angle) in ANGLES.iter().enumerate() {
        let angle_in_radians = angle * PI / 180.0;
        let line = Array::new();

        let y_values: Vec<f64> = t_values.iter().map(|&t| {
            ((u * u * t * t) -
            (g * t * t * t * u * angle_in_radians.sin()) +
            (0.25 * g * g * t * t * t * t)).sqrt()
        }).collect();

        let mut max_t: f64 = 0.0;
        let mut max_y: f64 = 0.0;
        let mut min_t: f64 = 0.0;
        let mut min_y: f64 = 0.0;
        if index >= 3 {
            max_t = ((3.0 * u) / (2.0 * g))
                * (angle_in_radians.sin() - (angle_in_radians.sin() * angle_in_radians.sin() - 8.0 / 9.0).sqrt());

            max_y = ((u * u * max_t * max_t)
                - (g * max_t * max_t * max_t * u * angle_in_radians.sin())
                + (0.25 * g * g * max_t * max_t * max_t * max_t)).sqrt();
        }

        if index >= 4 {
            min_t = ((3.0 * u) / (2.0 * g))
                * (angle_in_radians.sin() + (angle_in_radians.sin() * angle_in_radians.sin() - 8.0 / 9.0).sqrt());

            min_y = ((u * u * min_t * min_t)
                - (g * min_t * min_t * min_t * u * angle_in_radians.sin())
                + (0.25 * g * g * min_t * min_t * min_t * min_t)).sqrt();
        }

        line.push(&Float64Array::from(y_values.as_slice()));
        line.push(&JsValue::from_f64(max_t));
        line.push(&JsValue::from_f64(max_y));
        line.push(&JsValue::from_f64(min_t));
        line.push(&JsValue::from_f64(min_y));
        result.push(&line);
    }

    Ok(result)
}