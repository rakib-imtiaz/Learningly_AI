from manim import *

class SimpleSine(Scene):
    def construct(self):
        # Title
        title = Text("Sine Wave", font_size=36).to_edge(UP)
        
        # Create axes
        axes = Axes(
            x_range=[0, 4*PI, PI],
            y_range=[-2, 2, 1],
            axis_config={"color": BLUE},
            tips=False
        ).scale(0.8)
        
        # Create sine wave
        sine_wave = axes.plot(lambda x: np.sin(x), color=YELLOW, x_range=[0, 4*PI])
        
        # Create unit circle
        circle = Circle(radius=1, color=WHITE).move_to(LEFT * 4 + UP * 1)
        
        # Create point on circle
        dot = Dot(color=RED).move_to(circle.get_center() + RIGHT)
        
        # Create angle tracker
        angle_tracker = ValueTracker(0)
        
        # Update dot position on circle
        dot.add_updater(
            lambda mob: mob.move_to(
                circle.get_center() + 
                np.array([np.cos(angle_tracker.get_value()), 
                         np.sin(angle_tracker.get_value()), 0])
            )
        )
        
        # Create projection line
        projection_line = always_redraw(
            lambda: DashedLine(
                dot.get_center(),
                axes.c2p(angle_tracker.get_value(), np.sin(angle_tracker.get_value())),
                color=RED
            )
        )
        
        # Create moving dot on sine wave
        sine_dot = always_redraw(
            lambda: Dot(
                axes.c2p(angle_tracker.get_value(), np.sin(angle_tracker.get_value())),
                color=RED
            )
        )
        
        # Labels
        circle_label = Text("Unit Circle", font_size=20).next_to(circle, DOWN)
        wave_label = Text("y = sin(x)", font_size=20).next_to(axes, DOWN)
        
        # Animation sequence
        self.play(Write(title))
        self.wait(1)
        
        self.play(Create(axes), Write(wave_label))
        self.wait(1)
        
        self.play(Create(circle), Write(circle_label))
        self.play(FadeIn(dot))
        self.wait(1)
        
        # Draw sine wave as angle increases
        self.play(Create(sine_wave), run_time=3)
        self.wait(1)
        
        # Show connection between circle and wave
        self.play(FadeIn(projection_line), FadeIn(sine_dot))
        self.wait(1)
        
        # Animate the connection
        self.play(
            angle_tracker.animate.set_value(4*PI),
            run_time=6,
            rate_func=linear
        )
        
        self.wait(2)