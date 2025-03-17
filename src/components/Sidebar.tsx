import { Link, useLocation } from 'react-router-dom';
import { APP_VERSION } from '../config/version';

// SVG Icons as components
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const GradientIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="12" y1="3" x2="12" y2="21"></line>
  </svg>
);

const TextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7"></polyline>
    <line x1="9" y1="20" x2="15" y2="20"></line>
    <line x1="12" y1="4" x2="12" y2="20"></line>
  </svg>
);

const AIIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10H12V2zM21.17 8H12V4.83L21.17 8zM12 12h10a10 10 0 0 1-10 10V12z"></path>
  </svg>
);

const GameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10H12V2zM21.17 8H12V4.83L21.17 8zM12 12h10a10 10 0 0 1-10 10V12z"></path>
  </svg>
);

const TranslateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15c0 4.42 -3.58 8 -8 8s-8 -3.58 -8 -8 3.58 -8 8 -8 8 3.58 8 8z"></path>
    <path d="M3 9l9 9 9 -9"></path>
  </svg>
);

const SpeechIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10H12V2zM21.17 8H12V4.83L21.17 8zM12 12h10a10 10 0 0 1-10 10V12z"></path>
  </svg>
);

export default function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="sidebar" style={{ backgroundColor: '#1e293b' }}>
      <div className="sidebar-header" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingBottom: 'var(--space-4)', 
        marginBottom: 'var(--space-6)' 
      }}>
        <Link to="/" className="sidebar-brand" style={{ 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>B</span>
          <span style={{ fontSize: '0.85rem' }}>BRAD'S TOOLS</span>
        </Link>
        <div className="sidebar-version">Version {APP_VERSION}</div>
      </div>

      <div className="sidebar-nav" style={{ marginBottom: 'var(--space-6)' }}>
        <Link
          to="/"
          className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="sidebar-item-icon"><DashboardIcon /></span>
          Dashboard
        </Link>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Image Tools</div>
        <div className="sidebar-nav">
          <Link
            to="/tools/text"
            className={`sidebar-item ${location.pathname === '/tools/text' ? 'active' : ''}`}
          >
            <span className="sidebar-item-icon"><TextIcon /></span>
            Text Generator
          </Link>
          <Link
            to="/tools/gradient"
            className={`sidebar-item ${location.pathname === '/tools/gradient' ? 'active' : ''}`}
          >
            <span className="sidebar-item-icon"><GradientIcon /></span>
            Gradient Generator
          </Link>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Games</div>
        <div className="sidebar-nav">
          <Link
            to="/tools/snake"
            className={`sidebar-item ${location.pathname === '/tools/snake' ? 'active' : ''}`}
          >
            <span className="sidebar-item-icon"><GameIcon /></span>
            Snake Game
          </Link>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">AI Tools</div>
        <div className="sidebar-nav">
          <Link
            to="/tools/translator"
            className={`sidebar-item ${location.pathname === '/tools/translator' ? 'active' : ''}`}
          >
            <span className="sidebar-item-icon"><TranslateIcon /></span>
            Translator
          </Link>
          <Link
            to="/tools/text-to-speech"
            className={`sidebar-item ${location.pathname === '/tools/text-to-speech' ? 'active' : ''}`}
          >
            <span className="sidebar-item-icon"><SpeechIcon /></span>
            Text to Speech
          </Link>
        </div>
      </div>
    </div>
  );
} 