const sliders = {
    theta: document.getElementById('theta'),
    g: document.getElementById('g'),
    u: document.getElementById('u'),
    h: document.getElementById('h'),
    r: document.getElementById('r')
};

const sliders2 = {
    g: document.getElementById('g2'),
    u: document.getElementById('u2'),
    h: document.getElementById('h2')
};

const values2 = {
    g: document.getElementById('g-value2'),
    u: document.getElementById('u-value2'),
    h: document.getElementById('h-value2')
};

const values = {
    theta: document.getElementById('theta-value'),
    g: document.getElementById('g-value'),
    u: document.getElementById('u-value'),
    h: document.getElementById('h-value'),
    r: document.getElementById('r-value')
};

// Get slider elements and values for the second plot
const targetSliders = {
    targetX: document.getElementById('targetX'),
    targetY: document.getElementById('targetY'),
    iu: document.getElementById('iu')
};

const targetValues = {
    targetX: document.getElementById('targetX-value'),
    targetY: document.getElementById('targetY-value'),
    iu: document.getElementById('iu-value')
};

const opt_sliders = {
    theta: document.getElementById('opt-theta'),
    g: document.getElementById('opt-g'),
    u: document.getElementById('opt-u'),
    h: document.getElementById('opt-h'),
    r: document.getElementById('opt-r')
};

const opt_values = {
    theta: document.getElementById('opt-theta-value'),
    g: document.getElementById('opt-g-value'),
    u: document.getElementById('opt-u-value'),
    h: document.getElementById('opt-h-value'),
    r: document.getElementById('opt-r-value')
};

const s_display = document.getElementById("s");
const s_max_display = document.getElementById("s_max");

// Update displayed values and plot the first trajectory
function updateValues() {
    for (const key in sliders) {
        values[key].textContent = sliders[key].value;
    }
    plotTrajectory();
}

function updateValues2() {
    for (const key in sliders2) {
        values2[key].textContent = sliders2[key].value;
    }

    plotTrajectories2();
    plotRangeVsTime();
}

// Update displayed values and plot the second trajectory
function updateTargetValues() {
    for (const key in targetSliders) {
        targetValues[key].textContent = targetSliders[key].value;
    }
    plotTargetTrajectory();
}

function updateOptValues() {
    for (const key in opt_sliders) {
        opt_values[key].textContent = opt_sliders[key].value;
    }
    plotOptTargetTrajectory();
}

function toDeg(rad){
    return (180/Math.PI)*rad
}
// Calculate and plot the first trajectory
function plotTrajectory() {
    const theta = parseFloat(sliders.theta.value) * Math.PI / 180;
    const g = parseFloat(sliders.g.value);
    const u = parseFloat(sliders.u.value);
    const h = parseFloat(sliders.h.value);
    const r = parseFloat(sliders.r.value);

    const R = (u * Math.cos(theta) / g) * (u * Math.sin(theta) + Math.sqrt((u * Math.sin(theta))**2 + 2 * g * h));
    const numPoints = 1000;
    const xValues = Array.from({ length: numPoints }, (_, i) => i * R / (numPoints - 1));
    const yValues = xValues.map(x => h + x * Math.tan(theta) - (g * x**2) / (2 * u**2 * Math.cos(theta)**2));
    const maxY = Math.max(...yValues);
    const apogeeX = xValues[yValues.indexOf(maxY)];

    const trajectoryTrace = {
        x: xValues,
        y: yValues,
        xaxis_range: [0, 100],
        mode: 'lines',
        name: 'Trajectory',
        line: { color: 'blue' }
    };

    const apogeeTrace = {
        x: [apogeeX],
        y: [maxY],
        mode: 'markers',
        name: 'Apogee',
        marker: { color: 'green', size: 10 }
    };

    const data = [trajectoryTrace, apogeeTrace];

    const layout = {
        title: 'Projectile Motion',
        xaxis: { 
            title: 'Horizontal Distance (m)', 
            autorange: false, 
            range: [0, r] 
        },
        yaxis: { title: 'Vertical Distance (m)', rangemode: 'tozero' }
    };

    Plotly.newPlot('plot', data, layout);
}

function calculateLaunchAngles(X, Y, u) {
    const g = 9.81; // acceleration due to gravity in m/s^2

    // Calculate the common term inside the square root
    const commonTerm = 1 - (2 * g * Y) / (u * u) - (g * g * X * X) / (u * u * u * u);

    // Check if the common term is negative, in which case the solution is not real
    if (commonTerm < 0) {
        throw new Error("No real solutions for the given parameters.");
    }

    // Calculate both possible values for tan(theta)
    const tanTheta1 = (u * u) / (g * X) * (1 + Math.sqrt(commonTerm));
    const tanTheta2 = (u * u) / (g * X) * (1 - Math.sqrt(commonTerm));

    // Convert tan(theta) to theta in radians
    const theta1 = Math.atan(tanTheta1);
    const theta2 = Math.atan(tanTheta2);

    return [theta1,theta2]
}

function optT(u, g, h, theta){
    // Calculate the optimal angle for maximum range
    const theta_opt = Math.asin(1/Math.sqrt(2+2*g*h/(u*u)))

    // Calculate the maximum range R_opt for the optimal angle (For later extensions)
    const R_opt = (u * Math.cos(theta_opt) / g) * (u * Math.sin(theta_opt) + Math.sqrt((u * Math.sin(theta_opt))**2 + 2 * g * h));
    return [theta_opt, R_opt]
}
// Calculate and plot the second trajectory
function plotTargetTrajectory() {
    const g = parseFloat(sliders.g.value);
    const X = parseFloat(targetSliders.targetX.value);
    const Y = parseFloat(targetSliders.targetY.value);
    const u = parseFloat(targetSliders.iu.value);

    const angles = calculateLaunchAngles(X, Y, u);
    const uMin = Math.sqrt(g*Y+g*Math.sqrt(X*X+Y*Y));  // minimum launch speed
    
    const thetaHigh = angles[0]
    const thetaLow = angles[1]

    const numPoints = 300;
    h = 0
    let optValues = optT(u, g, h, 0);
    optTheta = optValues[0]
    optRange = optValues[1]
    const optxValues = Array.from({ length: numPoints }, (_, i) => i * optRange / (numPoints - 1));
    const optYValues = optxValues.map(x => h + x * Math.tan(optTheta) - (g * x**2) / (2 * u**2 * Math.cos(optTheta)**2));
    

    let yValuesMin = optxValues.map(x => x*( (Y + Math.sqrt(X*X + Y*Y))/X ) - x*x*(Math.sqrt(X*X + Y*Y)/(X*X)) ).filter( x => x > -1 );
    let yValuesLow = optxValues.map(x => x*Math.tan(thetaLow)-(g/(2*u*u))*(1+Math.tan(thetaLow)*Math.tan(thetaLow))*x*x).filter( x => x > -1 );
    let yValuesHigh = optxValues.map(x => x*Math.tan(thetaHigh)-(g/(2*u*u))*(1+Math.tan(thetaHigh)*Math.tan(thetaHigh))*x*x).filter( x => x > -1 );
    let yValuesBounding = optxValues.map( x => (u*u)/(2*g) - (g/(2*u*u))*x*x ).filter( x => x > -1 );
    yValuesMin.push(0); yValuesHigh.push(0); yValuesLow.push(0); yValuesBounding.push(0);

    const minBallTrace = {
        x: optxValues,
        y: yValuesMin,
        mode: 'lines',
        name: 'Min u',
        line: { color: 'grey' }
    };

    const lowBallTrace = {
        x: optxValues,
        y: yValuesLow,
        mode: 'lines',
        name: 'Low Ball Trajectory',
        line: { color: 'red' }
    };

    const highBallTrace = {
        x: optxValues,
        y: yValuesHigh,
        mode: 'lines',
        name: 'High Ball Trajectory',
        line: { color: 'green' }
    };

    const targetTrace = {
        x: [X],
        y: [Y],
        mode: 'markers',
        name: 'Target',
        marker: { color: 'blue', size: 10 }
    };

    const optTrajectoryTrace = {
        x: optxValues,
        y: optYValues,
        xaxis_range: [0, 100],
        mode: 'lines',
        name: 'Optimal Range',
        line: { color: 'orange' }
    };

    const boundingTrace = {
        x: optxValues,
        y: yValuesBounding,
        xaxis_range: [0, 100],
        mode: 'lines',
        name: 'Bounding',
        line: {
            dash: 'dot',
            color: 'purple',
        }
    };

    const data = [lowBallTrace, highBallTrace, targetTrace, minBallTrace, optTrajectoryTrace, boundingTrace];

    const layout = {
        title: 'Target Projectile Motion',
        xaxis: { 
            title: 'Horizontal Distance (m)'
        },
        yaxis: { title: 'Vertical Distance (m)', rangemode: 'tozero' }
    };

    Plotly.newPlot('plot-target', data, layout);
}

function plotOptTargetTrajectory() {
    const theta = parseFloat(opt_sliders.theta.value) * Math.PI / 180;
    const g = parseFloat(opt_sliders.g.value);
    const u = parseFloat(opt_sliders.u.value);
    const h = parseFloat(opt_sliders.h.value);
    const r = parseFloat(opt_sliders.r.value);

    optValues = optT(u, g, h, theta);
    optTheta = optValues[0]
    optRange = optValues[1]

    const R = (u * Math.cos(theta) / g) * (u * Math.sin(theta) + Math.sqrt((u * Math.sin(theta))**2 + 2 * g * h));
    const numPoints = 1000;
    const xValues = Array.from({ length: numPoints }, (_, i) => i * R / (numPoints - 1));
    const yValues = xValues.map(x => h + x * Math.tan(theta) - (g * x**2) / (2 * u**2 * Math.cos(theta)**2));

    const optxValues = Array.from({ length: numPoints }, (_, i) => i * optRange / (numPoints - 1));
    const optYValues = optxValues.map(x => h + x * Math.tan(optTheta) - (g * x**2) / (2 * u**2 * Math.cos(optTheta)**2));
    const maxY = Math.max(...yValues);
    const apogeeX = xValues[yValues.indexOf(maxY)];

    console.log(R, optRange, );
    s_max_display.innerHTML = `${Math.round(distTravelled(u, optTheta, g, h)*100)/100}m`;
    s_display.innerHTML = `${Math.round(distTravelled(u, theta, g, h)*100)/100}m`;

    const trajectoryTrace = {
        x: xValues,
        y: yValues,
        xaxis_range: [0, 100],
        mode: 'lines',
        name: 'Trajectory',
        line: { color: 'blue' }
    };

    const optTrajectoryTrace = {
        x: optxValues,
        y: optYValues,
        xaxis_range: [0, 100],
        mode: 'lines',
        name: 'Trajectory',
        line: { color: 'green' }
    };
    
    const apogeeTrace = {
        x: [apogeeX],
        y: [maxY],
        mode: 'markers',
        name: 'Apogee',
        marker: { color: 'green', size: 10 }
    };

    const data = [trajectoryTrace, optTrajectoryTrace, apogeeTrace];

    const layout = {
        title: 'Projectile Motion',
        xaxis: { 
            title: 'Horizontal Distance (m)', 
            autorange: false, 
            range: [0, r] 
        },
        yaxis: { title: 'Vertical Distance (m)', rangemode: 'tozero' }
    };

    Plotly.newPlot('opt-plot-target', data, layout);
}

function projectilePosition(u, theta, g, h, t) {
    // Calculate the x and y positions at time t
    const x = u * t * Math.cos(theta);
    const y = h + u * t * Math.sin(theta) - 0.5 * g * t * t;

    return { x: x, y: y };
}

function plotTrajectories2() {
    // Get inputs
    const g = parseFloat(sliders2.g.value);
    const u = parseFloat(sliders2.u.value);
    const h = parseFloat(sliders2.h.value);

    // Define angles
    const angles = [30, 45, 60, 70.55, 78, 85];

    // Initialize data traces
    const data = [];

    angles.forEach((theta, index) => {
        // Calculate the maximum range R
        theta *= Math.PI / 180
        const R = (u * Math.cos(theta) / g) * (u * Math.sin(theta) + Math.sqrt((u * Math.sin(theta))**2 + 2 * g * h));

        // Generate equally spaced x values
        const numPoints = 1000;
        const xValues = Array.from({ length: numPoints }, (_, i) => i * R / (numPoints - 1));

        // Calculate y values
        const yValues = xValues.map(x => h + x * Math.tan(theta) - (g * x**2) / (2 * u**2 * Math.cos(theta)**2));

        // Create data trace for trajectory
        const trajectoryTrace = {
            x: xValues,
            y: yValues,
            mode: 'lines',
            name: `Trajectory ${['30°', '45°', '60°', '70.5°', '78°', '85°'][index]}`,
            line: ['blue','red','yellow','green','orange','purple'][index]
        };

        let maxT;
        let maxY;
        if(index>=3){
            maxT = ((3*u)/(2*g))*(Math.sin(theta) - Math.sqrt(Math.sin(theta)*Math.sin(theta)-8/9))
            maxY = Math.sqrt(u*u*maxT*maxT - g*maxT*maxT*maxT*u*Math.sin(theta) + 0.25*g*g*maxT*maxT*maxT*maxT)
        }

        let minT;
        let minY;
        if(index>=4){
            minT = ((3*u)/(2*g))*(Math.sin(theta) + Math.sqrt(Math.sin(theta)*Math.sin(theta)-8/9))
            minY = Math.sqrt(u*u*minT*minT - g*minT*minT*minT*u*Math.sin(theta) + 0.25*g*g*minT*minT*minT*minT)
        }
        
        const maxRangeTrace = {
            x: [projectilePosition(u, theta, g, h, maxT).x, projectilePosition(u, theta, g, h, minT).x],
            y: [projectilePosition(u, theta, g, h, maxT).y, projectilePosition(u, theta, g, h, minT).y],
            mode: 'markers',
            name: '',
            marker: { color: 'purple'},
            showlegend: false
        };

        data.push(trajectoryTrace);
        data.push(maxRangeTrace);
    });

    // Plot layout
    const layout = {
        title: 'Projectile Motion Trajectories',
        xaxis: { title: 'Horizontal Distance (m)' },
        yaxis: { title: 'Vertical Distance (m)', rangemode: 'tozero' }
    };

    Plotly.newPlot('trajectory-plot2', data, layout);
}

// Calculate and plot range vs time
function plotRangeVsTime() {
    // Get inputs
    const g = parseFloat(sliders2.g.value);
    const u = parseFloat(sliders2.u.value);
    const h = parseFloat(sliders2.h.value);

    // Define angles
    const angles = [30, 45, 60, 70.55, 78, 85];

    // Initialize data traces
    const data = [];

    angles.forEach((theta, index) => {
        // Calculate time of flight
        theta *= Math.PI / 180
        const t_flight = 10

        // Generate equally spaced time values
        const numPoints = 1000;
        const tValues = Array.from({ length: numPoints }, (_, i) => i * t_flight / (numPoints - 1));

        // Calculate x (range) values
        const xValues = tValues.map(t => Math.sqrt(u*u*t*t - g*t*t*t*u*Math.sin(theta) + 0.25*g*g*t*t*t*t));

        // Create data trace for range vs time
        const rangeTrace = {
            x: tValues,
            y: xValues,
            mode: 'lines',
            name: `Range ${['30°', '45°', '60°', '70.5°', '78°', '85°'][index]}`,
            line: ['blue','red','yellow','green','orange','purple'][index]
        };

        // Find the maximum and minimum range and mark it

        let maxT;
        let maxY;
        if(index>=3){
            maxT = ((3*u)/(2*g))*(Math.sin(theta) - Math.sqrt(Math.sin(theta)*Math.sin(theta)-8/9))
            maxY = Math.sqrt(u*u*maxT*maxT - g*maxT*maxT*maxT*u*Math.sin(theta) + 0.25*g*g*maxT*maxT*maxT*maxT)
        }

        let minT;
        let minY;
        if(index>=4){
            minT = ((3*u)/(2*g))*(Math.sin(theta) + Math.sqrt(Math.sin(theta)*Math.sin(theta)-8/9))
            minY = Math.sqrt(u*u*minT*minT - g*minT*minT*minT*u*Math.sin(theta) + 0.25*g*g*minT*minT*minT*minT)
        }


        const maxRangeTrace = {
            x: [minT, maxT],
            y: [minY, maxY],
            mode: 'markers',
            name: '',
            marker: { color: 'purple'},
            showlegend: false
        };

        data.push(rangeTrace, maxRangeTrace);
    });

    // Plot layout
    const layout = {
        title: 'Range vs Time',
        xaxis: { title: 'Time (s)' },
        yaxis: { title: 'Range (m)', rangemode: 'tozero' }
    };

    Plotly.newPlot('range-time-plot', data, layout);
}

// Add event listeners to sliders
for (const key in sliders2) {
    sliders2[key].addEventListener('input', updateValues2);
}

// Add event listeners to sliders for the first plot
for (const key in sliders) {
    sliders[key].addEventListener('input', updateValues);
}

// Add event listeners to sliders for the second plot
for (const key in targetSliders) {
    targetSliders[key].addEventListener('input', updateTargetValues);
}

for (const key in opt_sliders) {
    opt_sliders[key].addEventListener('input', updateOptValues);
}

// Initial plot for both trajectories
plotTrajectory();
plotTargetTrajectory();
plotOptTargetTrajectory();
plotTrajectories2();
plotRangeVsTime();

function distTravelled(u, theta, g, h) {
    // Helper function z_func
    function z_func(z) {
        return 0.5 * Math.log(Math.abs(Math.sqrt(1 + z * z) + z)) + 0.5 * z * Math.sqrt(1 + z * z);
    }

    // Calculate p.R
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    const tanTheta = Math.tan(theta);
    
    const R = (u * u / g) * (sinTheta * cosTheta + cosTheta * Math.sqrt(sinTheta * sinTheta + 2 * g * h / (u * u)));

    // Calculate a, b, c
    const a = (u * u) / (g * (1 + tanTheta * tanTheta));
    const b = tanTheta;
    const c = tanTheta - g * R * (1 + tanTheta * tanTheta) / (u * u);

    // Calculate p.s
    const s = a * (z_func(b) - z_func(c));

    return s;
}
