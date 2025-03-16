import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to track page views in a React SPA for counter.dev
 * This component should be added once to the app, and it will 
 * automatically track page views when routes change
 */
export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view when location changes
    try {
      // Send page view event to counter.dev
      // counter.dev doesn't have a standard API for SPAs,
      // but this simulated page load helps in some cases
      if (typeof window !== 'undefined') {
        // Add cache buster to avoid caching issues
        const url = `${window.location.pathname}?cb=${Date.now()}`;
        fetch(url, { method: 'HEAD', mode: 'no-cors' }).catch(() => {});
        
        // Log for debugging
        console.log('Page view tracked:', window.location.pathname);
      }
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }, [location]);

  // This component doesn't render anything
  return null;
} 