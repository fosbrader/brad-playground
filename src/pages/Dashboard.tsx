import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

// SVG Icons as components - remove unused ones
const GradientIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12a4 4 0 0 1 8 0" />
  </svg>
);

const TextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

const TranslateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8l4 4l-4 4" />
    <path d="M12 4h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7" />
  </svg>
);

const SpeechIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

// Define your tools
const tools = [
  {
    id: 'gradient',
    name: 'Gradient Generator',
    description: 'Create beautiful CSS gradients with a visual editor',
    path: '/tools/gradient',
    icon: <GradientIcon />,
    category: 'Image Tools'
  },
  {
    id: 'text-on-screen',
    name: 'Text on Screen Generator',
    description: 'Create images with custom text overlays',
    path: '/tools/text-on-screen',
    icon: <TextIcon />,
    category: 'Image Tools'
  },
  {
    id: 'translator',
    name: 'Translator',
    description: 'Translate text between multiple languages using AI',
    path: '/tools/translator',
    icon: <TranslateIcon />,
    category: 'AI Tools'
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert text to natural-sounding speech',
    path: '/tools/text-to-speech',
    icon: <SpeechIcon />,
    category: 'AI Tools'
  }
  // Add more tools here as you create them
];

// Get unique categories
const categories = [...new Set(tools.map(tool => tool.category))];

export default function Dashboard() {
  const { logout } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="navbar">
          <div>
            <h1 className="navbar-title" style={{ marginBottom: 'var(--space-2)' }}>Analytics Dashboard</h1>
            <div className="navbar-welcome">Welcome back, Brad! We've missed you. 👋</div>
          </div>
          
          <div className="navbar-links">
            <div className="navbar-search" style={{ width: '280px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--space-2)', opacity: 0.5 }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Search topics..."
                className="search-input"
              />
            </div>
            
            <button className="button-today">
              Today: {currentDate}
            </button>
            
            <button
              onClick={logout}
              className="button button-red"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="content">
          {/* Stats Section */}
          <div className="dashboard-grid grid-4">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Visitors</div>
                <div className="card-badge">Annual</div>
              </div>
              <div className="stat-value">0</div>
              <div className="stat-label">
                Since last week
                <span className="stat-change stat-change-positive">+14%</span>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <div className="card-title">Activity</div>
                <div className="card-badge">Annual</div>
              </div>
              <div className="stat-value">0</div>
              <div className="stat-label">
                Since last week
                <span className="stat-change stat-change-negative">-12%</span>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <div className="card-title">Real-Time</div>
                <div className="card-badge card-badge-primary">Monthly</div>
              </div>
              <div className="stat-value">0</div>
              <div className="stat-label">
                Since last week
                <span className="stat-change stat-change-negative">-18%</span>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <div className="card-title">Bounce</div>
                <div className="card-badge card-badge-success">Yearly</div>
              </div>
              <div className="stat-value">0</div>
              <div className="stat-label">
                Since last week
                <span className="stat-change stat-change-positive">+27%</span>
              </div>
            </div>
          </div>
          
          {/* Tools Section */}
          {categories.map(category => (
            <div key={category}>
              <h2 style={{ marginTop: 'var(--space-6)' }}>{category}</h2>
              
              <div className="grid grid-3">
                {tools
                  .filter(tool => tool.category === category)
                  .map((tool) => (
                    <Link 
                      key={tool.id} 
                      to={tool.path}
                      className="tool-card"
                    >
                      <div className="tool-card-icon">
                        {tool.icon}
                      </div>
                      <div className="tool-card-title">{tool.name}</div>
                      <div className="tool-card-description">{tool.description}</div>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
} 