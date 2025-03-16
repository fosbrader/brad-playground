import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to safely check storage
const checkStorage = (key: string) => {
  try {
    // Try sessionStorage first (persists across page refreshes but not tab/browser closes)
    const sessionValue = sessionStorage.getItem(key);
    if (sessionValue === 'true') return true;
    
    // Fallback to localStorage (persists indefinitely)
    const localValue = localStorage.getItem(key);
    if (localValue === 'true') {
      // If found in localStorage but not sessionStorage, update sessionStorage
      try {
        sessionStorage.setItem(key, 'true');
      } catch (e) {
        console.warn('SessionStorage not available');
      }
      return true;
    }
    
    return false;
  } catch (e) {
    console.warn('Storage access denied:', e);
    return false;
  }
};

// Helper function to safely set storage
const setStorage = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, value);
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('Storage access denied:', e);
  }
};

// Helper function to safely remove from storage
const removeStorage = (key: string) => {
  try {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Storage access denied:', e);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check storage on initial load
  useEffect(() => {
    const authStatus = checkStorage('isAuthenticated');
    if (authStatus) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string) => {
    // Simple password check - in a real app, you'd want to use a more secure approach
    // The password is stored in client-side code, so this is not truly secure
    if (password === 'mySecretPassword') {
      setIsAuthenticated(true);
      setStorage('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    removeStorage('isAuthenticated');
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