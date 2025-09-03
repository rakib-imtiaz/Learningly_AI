from manim import *

class FourierSeries(Scene):
    def construct(self):
        # Title
        title = Text("Fourier Series Approximation", font_size=36).to_edge(UP)
        
        # Create axes
        axes = Axes(
            x_range=[0, 4*PI, PI],
            y_range=[-2, 2, 1],
            axis_config={"color": BLUE},
            x_axis_config={
                "numbers_to_include": [PI, 2*PI, 3*PI, 4*PI],
                "numbers_with_elongated_ticks": [PI, 2*PI, 3*PI, 4*PI],
            },
        ).scale(0.8)
        
        # Target function (square wave)
        def square_wave(x):
            return 1 if (x % (2*PI)) < PI else -1
        
        # Fourier series approximation
        def fourier_approx(x, n_terms):
            result = 0
            for k in range(1, n_terms + 1, 2):
                result += (4/(k*PI)) * np.sin(k*x)
            return result
        
        # Create the target function graph
        target_points = []
        for x in np.linspace(0, 4*PI, 1000):
            target_points.append([x, square_wave(x), 0])
        
        target_func = VMobject()
        target_func.set_points_as_corners([axes.c2p(x, y, 0) for x, y, z in target_points])
        target_func.set_color(WHITE)
        
        # Fourier approximations with different numbers of terms
        fourier_graphs = []
        colors = [RED, ORANGE, YELLOW, GREEN, TEAL]
        
        for i, n_terms in enumerate([1, 3, 5, 7, 9]):
            graph = axes.plot(
                lambda x: fourier_approx(x, n_terms),
                color=colors[i % len(colors)],
                x_range=[0, 4*PI]
            )
            fourier_graphs.append(graph)
        
        # Labels
        x_label = axes.get_x_axis_label("x")
        y_label = axes.get_y_axis_label("f(x)")
        
        # Legend
        legend = VGroup()
        legend_title = Text("Number of terms:", font_size=20).move_to(RIGHT * 4 + UP * 2)
        legend.add(legend_title)
        
        for i, n_terms in enumerate([1, 3, 5, 7, 9]):
            color = colors[i % len(colors)]
            line = Line(ORIGIN, RIGHT * 0.5, color=color)
            text = Text(f"n = {n_terms}", font_size=16, color=color)
            item = VGroup(line, text.next_to(line, RIGHT, buff=0.1))
            item.next_to(legend_title, DOWN * (i + 1) * 0.5, aligned_edge=LEFT)
            legend.add(item)
        
        legend.move_to(RIGHT * 4)
        
        # Animation sequence
        self.play(Write(title))
        self.wait(1)
        
        self.play(Create(axes))
        self.play(Write(x_label), Write(y_label))
        self.wait(1)
        
        # Show target function
        self.play(Create(target_func), run_time=2)
        target_label = Text("Target: Square Wave", font_size=20, color=WHITE)
        target_label.next_to(axes, DOWN, aligned_edge=LEFT)
        self.play(Write(target_label))
        self.wait(1)
        
        # Show legend
        self.play(Write(legend))
        self.wait(1)
        
        # Animate Fourier approximations
        for i, graph in enumerate(fourier_graphs):
            if i == 0:
                self.play(Create(graph), run_time=2)
            else:
                self.play(Transform(fourier_graphs[0], graph), run_time=1.5)
            self.wait(1)
        
        self.wait(2)