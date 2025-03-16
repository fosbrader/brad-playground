import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to track page views in a React SPA
 * This component is a placeholder since counter.dev appears to be inactive
 * You may want to replace this with a different analytics solution
 */
export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Just log page views to console for now
    console.log('Page view:', location.pathname);
    
    // You could implement a different analytics solution here
    // Examples: Google Analytics, Plausible, Fathom, Simple Analytics, etc.
  }, [location]);

  // This component doesn't render anything
  return null;
} 