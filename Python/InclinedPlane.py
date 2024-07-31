import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

g = 9.81
v0 = 10
theta = 45
alpha = 30
e = 0.75
time_of_flight = 10

theta_rad = np.radians(theta)
alpha_rad = np.radians(alpha)

vx0 = v0 * np.cos(theta_rad)
vy0 = v0 * np.sin(theta_rad)

dt = 0.01
t_max = time_of_flight
t_values = np.arange(0, t_max, dt)

def calculate_trajectory():
    x = [0]
    y = [0]
    vx = vx0
    vy = vy0
    t = 0

    while t < t_max:
        t += dt
        x_new = x[-1] + vx * dt
        y_new = y[-1] + vy * dt - 0.5 * g * dt ** 2
        vy_new = vy - g * dt

        if x_new >= 1 and y_new < x_new * np.tan(alpha_rad):
            v_parallel = (vx * np.cos(alpha_rad) + vy_new * np.sin(alpha_rad))
            v_perpendicular = (vy_new * np.cos(alpha_rad) - vx * np.sin(alpha_rad))
            v_perpendicular *= -e
            vx = v_parallel * np.cos(alpha_rad) - v_perpendicular * np.sin(alpha_rad)
            vy_new = v_parallel * np.sin(alpha_rad) + v_perpendicular * np.cos(alpha_rad)
            y_new = x_new * np.tan(alpha_rad)

        x.append(x_new)
        y.append(y_new)
        vy = vy_new

    return x, y

x, y = calculate_trajectory()

fig, ax = plt.subplots()
ax.set_xlim(0, max(x) * 1.1)
ax.set_ylim(0, max(y) * 1.1)

x_plane = np.linspace(1, max(x) * 1.1, 100)
y_plane = x_plane * np.tan(alpha_rad)
ax.plot(x_plane, y_plane, 'r-', label='Inclined Plane')

line, = ax.plot([], [], 'bo', label='Ball Trajectory')

def init():
    line.set_data([], [])
    return line,

def animate(i):
    line.set_data([x[i]], [y[i]])
    return line,

ani = animation.FuncAnimation(fig, animate, init_func=init, frames=len(t_values), interval=dt*1000, blit=True)

ax.legend()

plt.show()
