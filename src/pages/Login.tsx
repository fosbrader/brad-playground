import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APP_VERSION } from '../config/version';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '2rem',
    }}>
      {/* Background gradient */}
      <div style={{
        content: '""',
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        backgroundRepeat: 'no-repeat',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '450px',
        padding: '2rem',
        backgroundColor: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>B</div>
          <div style={{ fontSize: '0.85rem' }}>BRAD'S TOOLS</div>
        </div>

        <h1 style={{ fontSize: '2rem', textAlign: 'center', margin: 0 }}>Sign in</h1>

        <p style={{ 
          textAlign: 'center', 
          color: 'var(--color-text-secondary)',
          margin: 0,
          fontSize: '0.875rem'
        }}>
          A collection of useful web development utilities
        </p>
        
        <p style={{ 
          textAlign: 'center', 
          color: 'var(--color-text-tertiary)',
          margin: 0,
          fontSize: '0.75rem'
        }}>
          Version {APP_VERSION}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="input"
            style={{ 
              backgroundColor: 'rgba(23, 58, 94, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          />
          
          {error && (
            <div style={{ color: 'var(--color-text-danger)', fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="button"
            style={{
              marginTop: '0.5rem',
              backgroundColor: '#3b82f6',
              transition: 'all 0.2s',
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
} 