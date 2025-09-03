from manim import *

class CircleArea(Scene):
    def construct(self):
        # Title
        title = Text("Circle Area: A = πr²", font_size=36).to_edge(UP)
        
        # Create a circle
        radius = 2
        circle = Circle(radius=radius, color=BLUE, fill_opacity=0.3)
        circle.move_to(LEFT * 3)
        
        # Radius line
        radius_line = Line(circle.get_center(), circle.get_center() + RIGHT * radius, color=RED)
        radius_label = Text("r", color=RED, font_size=24).next_to(radius_line, DOWN)
        
        # Area calculation display
        area_text = Text("Area = π × r² = π × 2² = 4π ≈ 12.57", font_size=24)
        area_text.move_to(RIGHT * 3)
        
        # Create sectors to show how area is built up
        sectors = VGroup()
        num_sectors = 12
        for i in range(num_sectors):
            angle = 2 * PI / num_sectors
            sector = Sector(
                outer_radius=radius,
                angle=angle,
                start_angle=i * angle,
                color=YELLOW,
                fill_opacity=0.7
            )
            sector.move_to(circle.get_center())
            sectors.add(sector)
        
        # Animation sequence
        self.play(Write(title))
        self.wait(1)
        
        self.play(Create(circle))
        self.wait(1)
        
        self.play(Create(radius_line), Write(radius_label))
        self.wait(1)
        
        self.play(Write(area_text))
        self.wait(2)
        
        # Show sectors building up the area
        self.play(FadeOut(circle))
        for sector in sectors:
            self.play(FadeIn(sector), run_time=0.2)
        
        self.wait(1)
        
        # Transform sectors back to circle
        self.play(
            *[Transform(sector, circle) for sector in sectors],
            run_time=2
        )
        
        self.wait(2)