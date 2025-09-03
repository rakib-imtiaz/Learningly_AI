#!/usr/bin/env python3
"""
Setup script for Manim environment and pre-rendering scenes
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.8 or higher"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def install_manim():
    """Install Manim and dependencies"""
    print("📦 Installing Manim and dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Manim installation completed")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install Manim")
        return False

def check_manim_installation():
    """Verify Manim installation"""
    try:
        result = subprocess.run([sys.executable, "-m", "manim", "--version"], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Manim version: {result.stdout.strip()}")
            return True
        else:
            print("❌ Manim not properly installed")
            return False
    except FileNotFoundError:
        print("❌ Manim command not found")
        return False

def render_scene(scene_file, scene_name, output_dir):
    """Render a specific scene"""
    print(f"🎬 Rendering {scene_name}...")
    try:
        cmd = [
            sys.executable, "-m", "manim",
            "-ql",  # Quick low quality for web
            "--format", "mp4",
            "--save_last_frame", "false",
            scene_file,
            scene_name
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, cwd="manim_scenes")
        
        if result.returncode == 0:
            # Find and move the generated video
            media_dir = Path("manim_scenes/media/videos")
            for video_file in media_dir.rglob(f"{scene_name}.mp4"):
                dest_path = Path(output_dir) / f"{scene_name.lower()}.mp4"
                shutil.copy2(video_file, dest_path)
                print(f"✅ {scene_name} rendered successfully -> {dest_path}")
                return True
        else:
            print(f"❌ Failed to render {scene_name}")
            print(f"Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error rendering {scene_name}: {e}")
        return False

def pre_render_scenes():
    """Pre-render all example scenes"""
    scenes = [
        ("parabola.py", "Parabola"),
        ("circle_area.py", "CircleArea"),
        ("fourier.py", "FourierSeries")
    ]
    
    output_dir = Path("public/animations")
    output_dir.mkdir(exist_ok=True)
    
    print("🎬 Pre-rendering example scenes...")
    
    success_count = 0
    for scene_file, scene_name in scenes:
        scene_path = Path("manim_scenes") / scene_file
        if scene_path.exists():
            if render_scene(scene_file, scene_name, output_dir):
                success_count += 1
        else:
            print(f"⚠️  Scene file not found: {scene_path}")
    
    print(f"✅ Pre-rendering completed: {success_count}/{len(scenes)} scenes rendered")
    return success_count > 0

def setup_directories():
    """Create necessary directories"""
    directories = [
        "public/animations",
        "public/images/math",
        "temp/manim_renders",
        "manim_scenes"
    ]
    
    for dir_path in directories:
        Path(dir_path).mkdir(parents=True, exist_ok=True)
        print(f"📁 Created directory: {dir_path}")

def main():
    """Main setup function"""
    print("🔧 Setting up Manim environment for Math Visualizer...")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Setup directories
    setup_directories()
    
    # Install Manim
    if not install_manim():
        print("⚠️  Installation failed. Please check your Python environment.")
        sys.exit(1)
    
    # Verify installation
    if not check_manim_installation():
        print("⚠️  Manim verification failed.")
        sys.exit(1)
    
    # Pre-render scenes
    if pre_render_scenes():
        print("\n🎉 Setup completed successfully!")
        print("\nNext steps:")
        print("1. Start your Next.js development server: npm run dev")
        print("2. Navigate to /math-viz to see the Math Visualizer")
        print("3. Try creating custom scenes using the dynamic renderer")
    else:
        print("\n⚠️  Setup completed with warnings.")
        print("Pre-rendering failed, but you can still use the dynamic renderer.")

if __name__ == "__main__":
    main()