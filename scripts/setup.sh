#!/bin/bash

# Math Visualizer Setup Script
echo "🔧 Setting up Math Visualizer with Manim..."
echo "============================================"

# Check Python installation
echo "🐍 Checking Python installation..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    echo "✅ Python $PYTHON_VERSION found"
else
    echo "❌ Python 3 not found. Please install Python 3.8 or higher."
    exit 1
fi

# Check pip installation
echo "📦 Checking pip installation..."
if command -v pip3 &> /dev/null; then
    echo "✅ pip3 found"
else
    echo "❌ pip3 not found. Please install pip."
    exit 1
fi

# Install Manim and dependencies
echo "📦 Installing Manim Community Edition..."
pip3 install -r requirements.txt

# Verify Manim installation
echo "🔍 Verifying Manim installation..."
if python3 -m manim --version &> /dev/null; then
    MANIM_VERSION=$(python3 -m manim --version)
    echo "✅ $MANIM_VERSION installed successfully"
else
    echo "❌ Manim installation failed"
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p public/animations
mkdir -p public/images/math  
mkdir -p temp/manim_renders
echo "✅ Directories created"

# Pre-render example scenes (optional)
echo "🎬 Pre-rendering example scenes..."
cd manim_scenes

if [ -f "parabola.py" ]; then
    echo "Rendering Parabola scene..."
    python3 -m manim -ql parabola.py Parabola
    if [ -f "media/videos/parabola/480p30/Parabola.mp4" ]; then
        cp media/videos/parabola/480p30/Parabola.mp4 ../public/animations/parabola.mp4
        echo "✅ Parabola animation ready"
    fi
fi

if [ -f "circle_area.py" ]; then
    echo "Rendering Circle Area scene..."
    python3 -m manim -ql circle_area.py CircleArea
    if [ -f "media/videos/circle_area/480p30/CircleArea.mp4" ]; then
        cp media/videos/circle_area/480p30/CircleArea.mp4 ../public/animations/circle-area.mp4
        echo "✅ Circle Area animation ready"
    fi
fi

if [ -f "fourier.py" ]; then
    echo "Rendering Fourier Series scene..."
    python3 -m manim -ql fourier.py FourierSeries
    if [ -f "media/videos/fourier/480p30/FourierSeries.mp4" ]; then
        cp media/videos/fourier/480p30/FourierSeries.mp4 ../public/animations/fourier.mp4
        echo "✅ Fourier Series animation ready"
    fi
fi

cd ..

echo ""
echo "🎉 Math Visualizer setup completed!"
echo ""
echo "Next steps:"
echo "1. Start your development server: npm run dev"
echo "2. Navigate to /math-viz in your browser"
echo "3. Explore pre-rendered animations and create custom scenes"
echo ""
echo "For detailed setup instructions, see MATH_VISUALIZER_SETUP.md"