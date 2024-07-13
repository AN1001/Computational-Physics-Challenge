import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import matplotlib.patches as patches

g = 9.81  # acceleration due to gravity
e = 0.3  # coefficient of restitution

h0 = 10.0 # hieght intital
v0 = 15.0 # vertical velocity
vx0 = 15.0 # horizontal velocity initial

dt = 0.01 # time steps
t_max = 16.0

time = []
height = []
horizontal = []

t = 0.0
h = h0
v = v0
x = 0.0
vx = vx0
count = 0

while t < t_max:

    h = h + v * dt # height
    v = v - g * dt # velocity

    x = x + vx * dt # horizontal displacement

    # If the ball hits the ground...
    if h <= 0:
        h = 0
        v = -e * v
        count +=1

    time.append(t)
    height.append(h)
    horizontal.append(x)

    t += dt
    if count == 3: # stops when 5 collisions
        break

fig, ax = plt.subplots()
ax.set_xlim(0, max(horizontal) * 1.1)
ax.set_ylim(0, max(height) * 1.1)
ax.set_xlabel("Horizontal Displacement (m)")
ax.set_ylabel("Vertical Displacement (m)")
ax.set_title("Trajectory of a Bouncing Ball with Coefficient of Restitution 0.3")
ax.set_aspect('equal', 'box')

ball_radius = 0.5
ball = patches.Circle((horizontal[0], height[0]), ball_radius, fc='red')
ax.add_patch(ball)
line, = ax.plot([], [], 'b-')  # Line for trajectory

def init():
    ball.set_center((horizontal[0], height[0]))
    line.set_data([], [])
    return ball, line

def animate(i):
    ball.set_center((horizontal[i], height[i]))
    line.set_data(horizontal[:i + 1], height[:i + 1])
    return ball, line

anim = FuncAnimation(fig, animate, init_func=init,
                     frames=len(time), interval=dt * 1000, blit=True)
plt.show()
