import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with password:', password);
    const success = login(password);
    console.log('Login success:', success);
    
    if (success) {
      console.log('Redirecting to dashboard...');
      navigate('/');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--color-bg-primary)', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div className="login-container" style={{ maxWidth: '400px', width: '100%', padding: 'var(--space-4)' }}>
        {/* Logo */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span style={{ 
              color: 'var(--color-text-accent)', 
              fontSize: 'var(--font-size-3xl)', 
              fontWeight: '600',
              marginRight: 'var(--space-2)'
            }}>B</span>
            <span style={{ 
              color: 'var(--color-text-primary)', 
              fontSize: 'var(--font-size-xl)', 
              fontWeight: '600'
            }}>BRAD'S TOOLS</span>
          </div>
        </div>
      
        {/* Login Card */}
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <h2 style={{ 
            fontSize: 'var(--font-size-xl)', 
            fontWeight: '600', 
            marginBottom: 'var(--space-4)', 
            textAlign: 'center'
          }}>Sign In</h2>
          
          <p style={{ 
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-5)', 
            textAlign: 'center' 
          }}>
            Enter password to access web development tools
          </p>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ 
                display: 'block', 
                fontSize: 'var(--font-size-sm)', 
                fontWeight: '500', 
                marginBottom: 'var(--space-2)',
                color: 'var(--color-text-secondary)'
              }}>
                Password
              </label>
              <input
                type="password"
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            {error && (
              <div style={{ 
                marginBottom: 'var(--space-4)', 
                color: 'var(--color-text-danger)', 
                fontSize: 'var(--font-size-sm)', 
                textAlign: 'center' 
              }}>
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="button"
              style={{ width: '100%' }}
            >
              Sign In
            </button>
          </form>
          
          <div style={{ marginTop: 'var(--space-5)', textAlign: 'center' }}>
            <p style={{ 
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-tertiary)'
            }}>
              A collection of useful web development utilities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 