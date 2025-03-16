import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GradientGenerator from './tools/gradient/GradientGenerator';
import RouteTracker from './components/RouteTracker';
import React from 'react';
import './App.css';

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function AppRoutes() {
  return (
    <>
      <RouteTracker />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tools/gradient" 
          element={
            <ProtectedRoute>
              <GradientGenerator />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  const basename = import.meta.env.BASE_URL;
  
  return (
    <AuthProvider>
      <Router basename={basename}>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
