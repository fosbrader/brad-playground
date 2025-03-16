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
      // Force a reload of the counter script with the new page path
      if (typeof window !== 'undefined') {
        // This is a fallback to ensure tracking happens if the script in index.html fails
        const counterScript = document.createElement('script');
        counterScript.async = true;
        counterScript.src = `https://cdn.counter.dev/script.js?page=${encodeURIComponent(location.pathname)}&t=${Date.now()}`;
        counterScript.setAttribute('data-id', '757bceaa-78cc-4493-808d-010a1f6d38c5');
        counterScript.setAttribute('data-utcoffset', '-7');
        document.head.appendChild(counterScript);
        
        // Log for debugging
        console.log('Page view tracked from React component:', location.pathname);
        
        // Remove the script after a short delay to prevent cluttering the DOM
        setTimeout(() => {
          if (counterScript.parentNode) {
            counterScript.parentNode.removeChild(counterScript);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }, [location]);

  // This component doesn't render anything
  return null;
} 