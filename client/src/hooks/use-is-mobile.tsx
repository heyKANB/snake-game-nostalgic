import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsTouchDevice = () => {
      // Check if device has touch capabilities
      const hasTouchScreen = 'ontouchstart' in window || 
                            navigator.maxTouchPoints > 0 ||
                            navigator.maxTouchPoints > 0;
      
      // Check screen width for traditional mobile detection
      const isSmallScreen = window.innerWidth < MOBILE_BREAKPOINT;
      
      // Check for iPad specifically (iPad Air, iPad Pro, etc.)
      const isIPad = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchstart' in window;
      
      // Consider it mobile if it's a small screen OR if it's a touch-capable device like iPad
      const isTouchDevice = isSmallScreen || hasTouchScreen || isIPad;
      
      console.log('Touch device detection:', {
        hasTouchScreen,
        isSmallScreen,
        isIPad,
        screenWidth: window.innerWidth,
        userAgent: navigator.userAgent,
        result: isTouchDevice
      });
      
      setIsMobile(isTouchDevice);
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = checkIsTouchDevice;
    
    mql.addEventListener("change", onChange)
    checkIsTouchDevice();
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
