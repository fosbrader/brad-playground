import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function SampleTool2() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white' }}>
      <header className="header">
        <h1>Sample Tool 2</h1>
        <Link
          to="/"
          className="button"
        >
          Back to Dashboard
        </Link>
      </header>

      <main className="content">
        <div className="grid grid-2">
          <div className="card">
            <h2>Counter Demo</h2>
            <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>
              This is a simple counter demonstration.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#334155', padding: '1.5rem', borderRadius: '0.5rem' }}>
              <div style={{ width: '6rem', height: '6rem', borderRadius: '9999px', backgroundColor: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{count}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => setCount(count - 1)}
                  className="button button-red"
                >
                  Decrease
                </button>
                <button
                  onClick={() => setCount(count + 1)}
                  className="button button-green"
                >
                  Increase
                </button>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2>Counter Stats</h2>
            
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ backgroundColor: '#334155', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="text-sm text-muted">Current Value</span>
                  <span style={{ fontSize: '0.875rem', color: '#60a5fa' }}>{count}</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#475569', borderRadius: '9999px', height: '0.5rem' }}>
                  <div 
                    style={{ 
                      backgroundColor: '#3b82f6', 
                      height: '0.5rem', 
                      borderRadius: '9999px',
                      width: `${Math.min(Math.max((count + 10) * 5, 0), 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div style={{ backgroundColor: '#334155', padding: '1rem', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="text-sm text-muted">Positive/Negative</span>
                  <span style={{ fontSize: '0.875rem', color: count >= 0 ? '#10b981' : '#ef4444' }}>
                    {count >= 0 ? "Positive" : "Negative"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 