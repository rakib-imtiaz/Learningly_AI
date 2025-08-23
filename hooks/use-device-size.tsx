"use client"

import * as React from "react"

export type DeviceSize = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'unknown';

const breakpoints = {
  mobile: 640,    // sm
  tablet: 768,    // md
  laptop: 1024,   // ~13" laptop
  desktop: 1280,  // lg
};

export function useDeviceSize() {
  const [deviceSize, setDeviceSize] = React.useState<DeviceSize>('unknown');

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < breakpoints.mobile) {
        setDeviceSize('mobile');
      } else if (width < breakpoints.tablet) {
        setDeviceSize('tablet');
      } else if (width < breakpoints.laptop) {
        setDeviceSize('laptop');
      } else if (width >= breakpoints.desktop) {
        setDeviceSize('desktop');
      } else {
        setDeviceSize('laptop'); // Default for most 13" screens
      }
    };

    // Set initial size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceSize;
}

// Helper hooks for specific device types
export function useMobile() {
  const deviceSize = useDeviceSize();
  return deviceSize === 'mobile';
}

export function useTablet() {
  const deviceSize = useDeviceSize();
  return deviceSize === 'tablet';
}

export function useLaptop() {
  const deviceSize = useDeviceSize();
  return deviceSize === 'laptop';
}

export function useDesktop() {
  const deviceSize = useDeviceSize();
  return deviceSize === 'desktop';
}

// Hook for component scaling based on screen size
export function useScaleFactor() {
  const deviceSize = useDeviceSize();
  
  switch (deviceSize) {
    case 'mobile':
      return 0.8;
    case 'tablet':
      return 0.9;
    case 'laptop':
      return 1.0;
    case 'desktop':
      return 1.1;
    default:
      return 1.0;
  }
}


