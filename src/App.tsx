import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TextGenerator from './tools/text/TextGenerator';
import GradientGenerator from './tools/gradient/GradientGenerator';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/tools/text" element={isAuthenticated ? <TextGenerator /> : <Navigate to="/login" />} />
        <Route path="/tools/gradient" element={isAuthenticated ? <GradientGenerator /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
