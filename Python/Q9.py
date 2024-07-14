import numpy as np
import matplotlib.pyplot as plt

g = 9.81  
dt = 0.01  # time step
total_time = 1000  
# air resistance factor selected based on document write-up (parameters there were seemingly arbitrary)
k = 0.005 
m = 1000  # projectile mass


x0, y0 = 0, 0  # init positions
v0 = 5000  # init speed
angle = 45  # launch angle
vx0 = v0 * np.cos(np.radians(angle))
vy0 = v0 * np.sin(np.radians(angle))

num_steps = int(total_time / dt)

x_drag_free = np.zeros(num_steps)
y_drag_free = np.zeros(num_steps)
x_drag = np.zeros(num_steps)
y_drag = np.zeros(num_steps)

# Initial conditions (drag free)
x_drag_free[0], y_drag_free[0] = x0, y0
vx_drag_free, vy_drag_free = vx0, vy0

# Initial conditions (drag)
x_drag[0], y_drag[0] = x0, y0
vx_drag, vy_drag = vx0, vy0

# Initial acceleration (drag)
v_initial = np.sqrt(vx_drag**2 + vy_drag**2)
ax_drag = -k * v_initial * vx_drag / m
ay_drag = -g - k * v_initial * vy_drag / m

for i in range(1, num_steps):
    # Drag-free model
    x_drag_free[i] = x_drag_free[i-1] + vx_drag_free * dt
    y_drag_free[i] = y_drag_free[i-1] + vy_drag_free * dt - 0.5 * g * dt**2
    vy_drag_free -= g * dt

    if y_drag_free[i] < 0:
        break

for i in range(1, num_steps):
    # Drag model
    x_drag[i] = x_drag[i-1] + vx_drag * dt + 0.5 * ax_drag * dt**2
    y_drag[i] = y_drag[i-1] + vy_drag * dt + 0.5 * ay_drag * dt**2
    
    vx_drag_mid = vx_drag + 0.5 * ax_drag * dt
    vy_drag_mid = vy_drag + 0.5 * ay_drag * dt
    
    v = np.sqrt(vx_drag_mid**2 + vy_drag_mid**2)
    ax_drag = -k * v * vx_drag_mid / m
    ay_drag = -g - k * v * vy_drag_mid / m
    


    vx_drag += ax_drag * dt
    vy_drag += ay_drag * dt
    
    print(k, x_drag[i-1], y_drag[i-1], vx_drag, vy_drag, ax_drag, ay_drag)

    if y_drag[i] < 0:
        break

plt.figure(figsize=(12, 6))
plt.scatter(x_drag_free, y_drag_free, label='Drag-Free', color='blue', s=0.05)
plt.scatter(x_drag, y_drag, label='With Drag', color='red', s=0.05)
plt.xlabel('Horizontal Distance (m)')
plt.ylabel('Vertical Distance (m)')
plt.title('Drag-Free vs With Air Resistance models')
plt.legend()
plt.grid(True)
plt.show()