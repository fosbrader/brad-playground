import { Link } from 'react-router-dom';
import { APP_VERSION } from '../config/version';

// SVG Icons as components
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const GradientIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12a4 4 0 0 1 8 0" />
  </svg>
);

const TextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

const TranslateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8l4 4l-4 4" />
    <path d="M12 4h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7" />
  </svg>
);

const SpeechIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export default function Sidebar() {
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

      <div className="sidebar-nav" style={{ marginBottom: 'var(--space-5)' }}>
        <Link to="/" className="sidebar-item">
          <span className="sidebar-item-icon"><DashboardIcon /></span>
          Dashboard
        </Link>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">IMAGE TOOLS</div>
        <div className="sidebar-nav">
          <Link to="/tools/gradient" className="sidebar-item">
            <span className="sidebar-item-icon"><GradientIcon /></span>
            Gradient Generator
          </Link>
          <Link to="/tools/text-on-screen" className="sidebar-item">
            <span className="sidebar-item-icon"><TextIcon /></span>
            Text on Screen Generator
          </Link>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">AI TOOLS</div>
        <div className="sidebar-nav">
          <Link to="/tools/translator" className="sidebar-item">
            <span className="sidebar-item-icon"><TranslateIcon /></span>
            Translator
          </Link>
          <Link to="/tools/text-to-speech" className="sidebar-item">
            <span className="sidebar-item-icon"><SpeechIcon /></span>
            Text to Speech
          </Link>
        </div>
      </div>
    </div>
  );
} 