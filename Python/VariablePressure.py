# Notes, Barometric equations used to calculate air density (and therefore drag coefficient)
# Two equations, that distinguish between stratosphere and troposphere (and others)
# Height of troposphere varies with degrees on surface.
# Choose equation 1 or 2, for equation, use the constants provided in the table --> calculate for every step, based on incremented height 

import pandas as pandas
import numpy as np
import matplotlib.pyplot as plt

# Constants
R = 8.3144598 # Universal Gas constant
g = 9.80665
M = 0.0289644 # Molar mass of Earth Air

barometric_data = {
    'b': [0, 1, 2, 3, 4, 5, 6],
    'height': [0, 11000, 20000, 32000, 47000, 51000, 71000],
    'density': [1.2250, 0.36391, 0.08803, 0.01322, 0.00143, 0.00086, 0.000064],
    'temperature': [288.15, 216.65, 216.65, 228.65, 270.65, 270.65, 214.65],
    'L': [0.0065, 0.0, -0.001, -0.0028, 0.0, 0.0028, 0.002]
}

def air_density(b, h,):
    h_b = barometric_data["height"][b]
    L_b = barometric_data["L"][b]
    rho_b = barometric_data["density"][b]
    T_b = barometric_data["temperature"][b]

    if b == 1 or b == 4: 
        return rho_b * np.exp(- (g * M * (h - h_b)) / (R * T_b))
    else:
        return rho_b * ((T_b - (h - h_b)*L_b ) / (T_b)) ** (((g * M) / (R * L_b)) - 1)
    
def air_resistance_coefficient(air_density,):
    return (0.5 * c_d * air_density * A) / mass

mass = 1000
A = 1 # CSA
c_d = 0.1

b = 0

dt = 0.1
total_time = 1000
x0, y0 = 0, 0  # init positions
v0 = 5000  # init speed
angle = 45  # launch angle
vx0 = v0 * np.cos(np.radians(angle))
vy0 = v0 * np.sin(np.radians(angle))

num_steps = int(total_time / dt)

x_drag = np.zeros(num_steps)
y_drag = np.zeros(num_steps)

x_drag[0], y_drag[0] = x0, y0
vx_drag, vy_drag = vx0, vy0

v_initial = np.sqrt(vx_drag**2 + vy_drag**2)
ax_drag = -air_resistance_coefficient(air_density(b, y0)) * v_initial * vx_drag / mass
ay_drag = -g - air_resistance_coefficient(air_density(b, y0)) * v_initial * vy_drag / mass


def update(k, x, y, vx, vy, ax, ay):
    x += vx * dt + 0.5 * ax * dt**2
    y += vy * dt + 0.5 * ay * dt**2
    
    vx_mid = vx + 0.5 * ax * dt
    vy_mid = vy + 0.5 * ay * dt
    
    v = np.sqrt(vx_mid**2 + vy_mid**2)
    ax = -k * v * vx_mid
    ay = -g - k * v * vy_mid
    
    vx += ax * dt
    vy += ay * dt
    
    return x, y, vx, vy, ax, ay

for i in range(1, num_steps):

    if b != 6 and y_drag[i-1] > barometric_data['height'][b+1]:
        b += 1
    elif y_drag[i-1] < barometric_data['height'][b]:
        b -= 1

    # print(b, y_drag[i-1], air_density(b, y_drag[i-1]))
        
    k = air_resistance_coefficient(air_density(b, y_drag[i-1]))

    x_drag[i], y_drag[i], vx_drag, vy_drag, ax_drag, ay_drag = update(k, x_drag[i-1], y_drag[i-1], vx_drag, vy_drag, ax_drag, ay_drag)
    
    if y_drag[i] < 0:
        break

plt.figure(figsize=(12, 6))
plt.scatter(x_drag, y_drag, label='Varied Air Resistance', color='red', s=0.05)
plt.xlabel('Horizontal Distance (m)')
plt.ylabel('Vertical Distance (m)')
plt.title('Variable Air Resistance')
plt.legend()
plt.grid(True)
plt.show()   