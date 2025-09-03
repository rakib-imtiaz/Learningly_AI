@echo off
REM Math Visualizer Setup Script for Windows
echo 🔧 Setting up Math Visualizer with Manim...
echo ============================================

REM Check Python installation
echo 🐍 Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo ✅ Python %PYTHON_VERSION% found

REM Check pip installation
echo 📦 Checking pip installation...
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pip not found. Please install pip.
    pause
    exit /b 1
)
echo ✅ pip found

REM Install Manim and dependencies
echo 📦 Installing Manim Community Edition...
pip install -r requirements.txt

REM Verify Manim installation
echo 🔍 Verifying Manim installation...
python -m manim --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Manim installation failed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python -m manim --version 2^>^&1') do set MANIM_VERSION=%%i
echo ✅ %MANIM_VERSION% installed successfully

REM Create necessary directories
echo 📁 Creating directories...
if not exist "public\animations" mkdir "public\animations"
if not exist "public\images\math" mkdir "public\images\math"
if not exist "temp\manim_renders" mkdir "temp\manim_renders"
echo ✅ Directories created

REM Pre-render example scenes (optional)
echo 🎬 Pre-rendering example scenes...
cd manim_scenes

if exist "parabola.py" (
    echo Rendering Parabola scene...
    python -m manim -ql parabola.py Parabola
    if exist "media\videos\parabola\480p30\Parabola.mp4" (
        copy "media\videos\parabola\480p30\Parabola.mp4" "..\public\animations\parabola.mp4" >nul
        echo ✅ Parabola animation ready
    )
)

if exist "circle_area.py" (
    echo Rendering Circle Area scene...
    python -m manim -ql circle_area.py CircleArea
    if exist "media\videos\circle_area\480p30\CircleArea.mp4" (
        copy "media\videos\circle_area\480p30\CircleArea.mp4" "..\public\animations\circle-area.mp4" >nul
        echo ✅ Circle Area animation ready
    )
)

if exist "fourier.py" (
    echo Rendering Fourier Series scene...
    python -m manim -ql fourier.py FourierSeries
    if exist "media\videos\fourier\480p30\FourierSeries.mp4" (
        copy "media\videos\fourier\480p30\FourierSeries.mp4" "..\public\animations\fourier.mp4" >nul
        echo ✅ Fourier Series animation ready
    )
)

cd ..

echo.
echo 🎉 Math Visualizer setup completed!
echo.
echo Next steps:
echo 1. Start your development server: npm run dev
echo 2. Navigate to /math-viz in your browser  
echo 3. Explore pre-rendered animations and create custom scenes
echo.
echo For detailed setup instructions, see MATH_VISUALIZER_SETUP.md
pause