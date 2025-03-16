import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper cookie functions
const setCookie = (name: string, value: string, days: number = 7) => {
  try {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + value + expires + "; path=/";
    console.log('Cookie set:', name);
  } catch (e) {
    console.error('Error setting cookie:', e);
  }
};

const getCookie = (name: string) => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  } catch (e) {
    return null;
  }
};

const deleteCookie = (name: string) => {
  try {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  } catch (e) {
    console.error('Error deleting cookie:', e);
  }
};

// Helper function to safely check storage
const checkStorage = (key: string) => {
  console.log('Checking storage for key:', key);
  
  try {
    // Check cookie first
    const cookieValue = getCookie(key);
    if (cookieValue === 'true') {
      console.log('Found auth in cookie');
      return true;
    }
    
    // Try sessionStorage
    const sessionValue = sessionStorage.getItem(key);
    console.log('SessionStorage value:', sessionValue);
    
    if (sessionValue === 'true') {
      console.log('Found auth in sessionStorage');
      return true;
    }
    
    // Fallback to localStorage
    const localValue = localStorage.getItem(key);
    console.log('LocalStorage value:', localValue);
    
    if (localValue === 'true') {
      // If found in localStorage but not in cookie or sessionStorage, update them
      console.log('Found auth in localStorage, updating other storage methods');
      try {
        setCookie(key, 'true');
        sessionStorage.setItem(key, 'true');
      } catch (e) {
        console.warn('Error updating storage:', e);
      }
      return true;
    }
    
    console.log('Auth not found in any storage method');
    return false;
  } catch (e) {
    console.error('Storage access error:', e);
    return false;
  }
};

// Helper function to safely set storage
const setStorage = (key: string, value: string) => {
  console.log('Setting storage for key:', key, 'with value:', value);
  
  try {
    // Set in all storage methods for redundancy
    setCookie(key, value);
    sessionStorage.setItem(key, value);
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('Error setting storage:', e);
    
    // Try to set at least in cookies if other methods fail
    try {
      setCookie(key, value);
    } catch (cookieError) {
      console.error('All storage methods failed:', cookieError);
    }
  }
};

// Helper function to safely remove from storage
const removeStorage = (key: string) => {
  console.log('Removing storage for key:', key);
  
  try {
    deleteCookie(key);
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Error removing from storage:', e);
    
    // Try to remove at least from cookies if other methods fail
    try {
      deleteCookie(key);
    } catch (cookieError) {
      console.error('All storage removal methods failed:', cookieError);
    }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check auth status on initial load
  useEffect(() => {
    const checkAuth = () => {
      // Check cookie first
      const cookieAuth = getCookie('isAuthenticated');
      if (cookieAuth === 'true') {
        setIsAuthenticated(true);
        return;
      }
      
      // If cookie auth failed, try localStorage as fallback
      try {
        const localAuth = localStorage.getItem('isAuthenticated');
        if (localAuth === 'true') {
          setIsAuthenticated(true);
          // Set cookie for future auth checks
          setCookie('isAuthenticated', 'true');
        }
      } catch (e) {
        // Local storage might fail in some browsers/contexts
      }
    };
    
    // Run immediately and again after a small delay
    checkAuth();
    const timeoutId = setTimeout(checkAuth, 300);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const login = (password: string) => {
    if (password === 'mySecretPassword') {
      setIsAuthenticated(true);
      
      // Set in both cookie and localStorage for redundancy
      setCookie('isAuthenticated', 'true');
      try {
        localStorage.setItem('isAuthenticated', 'true');
      } catch (e) {
        // Ignore localStorage errors
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    deleteCookie('isAuthenticated');
    try {
      localStorage.removeItem('isAuthenticated');
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 