import { Link } from 'react-router-dom';

export default function SampleTool1() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white' }}>
      <header className="header">
        <h1>Sample Tool 1</h1>
        <Link
          to="/"
          className="button"
        >
          Back to Dashboard
        </Link>
      </header>

      <main className="content">
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2>Sample Tool 1</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
            This is a sample tool page. Replace this content with your actual tool's functionality.
          </p>
          
          <div style={{ backgroundColor: '#334155', padding: '1rem', borderRadius: '0.5rem' }}>
            <p style={{ color: '#cbd5e1' }}>
              Each tool has its own directory structure in the src/tools folder,
              allowing for independent development and organization.
            </p>
          </div>
        </div>
        
        <div className="grid grid-2">
          <div className="card">
            <h3>Tool Features</h3>
            <ul style={{ marginTop: '1rem', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ marginRight: '0.5rem' }}>✅</span> Feature 1
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ marginRight: '0.5rem' }}>✅</span> Feature 2
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ marginRight: '0.5rem' }}>✅</span> Feature 3
              </li>
            </ul>
          </div>
          
          <div className="card">
            <h3>Tool Controls</h3>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                  Option 1
                </label>
                <input 
                  type="text" 
                  className="input"
                  placeholder="Enter value"
                />
              </div>
              
              <button className="button" style={{ width: '100%', marginTop: '1rem' }}>
                Run Tool
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 