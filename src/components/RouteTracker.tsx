import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to track page views in a React SPA
 * Currently just logs to console since external analytics are disabled
 */
export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page views with counter.dev
    const script = document.createElement('script');
    script.async = true;
    script.dataset.counterDev = "https://counter.dev/";
    script.dataset.id = "d4c8a8c8-c7d3-4c7c-9f8c-8c7d3c7c9f8c";
    script.dataset.utcoffset = "-5";
    
    // Add current page path and timestamp to prevent caching
    const timestamp = new Date().getTime();
    script.src = `https://counter.dev/track.js?page=${location.pathname}&t=${timestamp}`;
    
    document.body.appendChild(script);
    
    // Remove script after 2 seconds to keep DOM clean
    const timeoutId = setTimeout(() => {
      document.body.removeChild(script);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [location]);

  // This component doesn't render anything
  return null;
} 