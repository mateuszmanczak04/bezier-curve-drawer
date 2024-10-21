import tkinter as tk
from math import pow

# Setup consts
CANVAS_WIDTH = 1200
CANVAS_HEIGHT = 800
POINT_RADIUS = 8

# Class to represent a point


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y


# Points list
points = [
    Point(100, 100),
    Point(400, 20),
    Point(50, 480),
    Point(400, 400),
    Point(800, 300),
    Point(500, 100),
    Point(800, 200),
    Point(1000, 500),
    Point(900, 650),
    Point(500, 700),
]

current_point_index = -1
drawing_precision = 0.01

# Create main window
root = tk.Tk()
root.title("Bezier Curve Drawing")

# Create canvas
canvas = tk.Canvas(root, width=CANVAS_WIDTH, height=CANVAS_HEIGHT, bg='#DDD')
canvas.pack()

# Draw helper lines between points


def draw_helper_lines(A, B, C, D):
    canvas.create_line(A.x, A.y, B.x, B.y, fill="#aaa", width=1)
    canvas.create_line(C.x, C.y, D.x, D.y, fill="#aaa", width=1)

# Draw the Bezier curve


def draw_curve(A, B, C, D):
    coords = []
    for t in frange(0, 1, drawing_precision):
        x = (A.x * pow(1 - t, 3) +
             3 * B.x * t * pow(1 - t, 2) +
             3 * C.x * pow(t, 2) * (1 - t) +
             D.x * pow(t, 3))
        y = (A.y * pow(1 - t, 3) +
             3 * B.y * t * pow(1 - t, 2) +
             3 * C.y * pow(t, 2) * (1 - t) +
             D.y * pow(t, 3))
        coords.extend((x, y))
    canvas.create_line(coords, fill='#333', width=3)

# Draw points as small circles


def draw_points(points):
    for point in points:
        canvas.create_oval(point.x - POINT_RADIUS, point.y - POINT_RADIUS,
                           point.x + POINT_RADIUS, point.y + POINT_RADIUS,
                           fill='#444', outline='')

# Redraw everything


def repaint():
    canvas.delete("all")
    for i in range(0, len(points) - 1, 3):
        draw_helper_lines(points[i], points[i + 1],
                          points[i + 2], points[i + 3])
        draw_curve(points[i], points[i + 1], points[i + 2], points[i + 3])
    draw_points(points)

# Utility function for floating range


def frange(start, stop, step):
    while start < stop:
        yield start
        start += step

# Mouse event handlers


def on_mouse_down(event):
    global current_point_index
    for index, point in enumerate(points):
        if (point.x - POINT_RADIUS <= event.x <= point.x + POINT_RADIUS and
                point.y - POINT_RADIUS <= event.y <= point.y + POINT_RADIUS):
            current_point_index = index
            return


def on_mouse_move(event):
    global current_point_index
    if current_point_index == -1:
        return
    points[current_point_index].x = event.x
    points[current_point_index].y = event.y
    repaint()


def on_mouse_up(event):
    global current_point_index
    current_point_index = -1


# Register mouse events
canvas.bind("<ButtonPress-1>", on_mouse_down)
canvas.bind("<B1-Motion>", on_mouse_move)
canvas.bind("<ButtonRelease-1>", on_mouse_up)

# Create precision input and button
precision_input = tk.Entry(root)
precision_input.insert(0, str(drawing_precision))
precision_input.pack(side=tk.LEFT)


def set_precision():
    global drawing_precision
    try:
        drawing_precision = float(precision_input.get())
        repaint()
    except ValueError:
        pass


precision_button = tk.Button(root, text="Set Precision", command=set_precision)
precision_button.pack(side=tk.LEFT)

# Start the app
repaint()
root.mainloop()
