from manim import *

class Parabola(Scene):
    def construct(self):
        # Create coordinate axes
        axes = Axes(
            x_range=[-4, 4, 1],
            y_range=[-1, 10, 1],
            axis_config={"color": BLUE},
            x_axis_config={
                "numbers_to_include": np.arange(-4, 5, 2),
            },
            y_axis_config={
                "numbers_to_include": np.arange(0, 11, 2),
            },
        )
        
        # Create the parabola function
        parabola = axes.plot(lambda x: x**2, color=YELLOW, x_range=[-3, 3])
        
        # Add labels
        x_label = axes.get_x_axis_label("x")
        y_label = axes.get_y_axis_label("y = x^2")
        
        # Add title
        title = Text("Quadratic Function: y = x²", font_size=36).to_edge(UP)
        
        # Create point tracker
        dot = Dot(color=RED)
        x_tracker = ValueTracker(-3)
        
        # Update dot position
        dot.add_updater(
            lambda mob: mob.move_to(
                axes.c2p(x_tracker.get_value(), x_tracker.get_value()**2)
            )
        )
        
        # Coordinate text
        coord_text = always_redraw(
            lambda: Text(
                f"({x_tracker.get_value():.1f}, {x_tracker.get_value()**2:.1f})",
                font_size=24
            ).next_to(dot, UP)
        )
        
        # Animations
        self.play(Write(title))
        self.wait(0.5)
        
        self.play(Create(axes))
        self.play(Write(x_label), Write(y_label))
        self.wait(1)
        
        self.play(Create(parabola), run_time=2)
        self.wait(1)
        
        self.play(FadeIn(dot), Write(coord_text))
        self.wait(1)
        
        # Animate the dot moving along the parabola
        self.play(x_tracker.animate.set_value(3), run_time=4, rate_func=smooth)
        self.wait(1)
        
        self.play(x_tracker.animate.set_value(-3), run_time=4, rate_func=smooth)
        self.wait(2)