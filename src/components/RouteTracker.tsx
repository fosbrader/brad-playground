import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to track page views in a React SPA
 * Currently just logs to console since external analytics are disabled
 */
export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Just log page views to console for development
    console.log('Page view:', location.pathname);
    
    // For production, you might want to implement:
    // 1. Local storage analytics collection
    // 2. Self-hosted analytics solution
    // 3. Privacy-focused analytics like Plausible, SimpleAnalytics, etc.
  }, [location]);

  // This component doesn't render anything
  return null;
} 