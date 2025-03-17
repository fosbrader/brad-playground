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

const GameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M20 12H4" />
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
    id: 'text',
    name: 'Text Generator',
    description: 'Create images with custom text overlays',
    path: '/tools/text',
    icon: <TextIcon />,
    category: 'Image Tools'
  },
  {
    id: 'snake',
    name: 'Snake Game',
    description: 'Classic snake game with a modern twist',
    path: '/tools/snake',
    icon: <GameIcon />,
    category: 'Games'
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
          <div className="navbar-search" style={{ 
            width: '280px',
            backgroundColor: 'rgba(36, 48, 77, 0.5)',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--space-2)', opacity: 0.5 }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search tools..."
              className="search-input"
            />
          </div>
          
          <div style={{ flex: 1 }}></div>
          
          <div className="navbar-links" style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            justifyContent: 'flex-end'
          }}>
            <div style={{ 
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-tertiary)',
              opacity: 0.7
            }}>
              {currentDate}
            </div>
            
            <button
              onClick={logout}
              className="icon-button"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                width: '40px',
                height: '40px',
                color: 'var(--color-text-primary)'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="content" style={{ paddingTop: 'var(--space-8)' }}>
          <div>
            <h1 className="navbar-title" style={{ marginBottom: 'var(--space-2)' }}>Pinned Tools</h1>
            <div className="navbar-welcome">Welcome back, Brad! We've missed you. 👋</div>
          </div>

          {/* Pinned Tools Section */}
          <div className="dashboard-grid grid-4" style={{ marginTop: 'var(--space-8)' }}>
            <Link to="/tools/gradient" className="card">
              <div style={{ position: 'relative' }}>
                <div style={{ marginBottom: 'var(--space-2)' }}>
                  <GradientIcon />
                </div>
                <div className="card-title">Gradient Generator</div>
                <div className="card-badge" style={{ 
                  position: 'absolute',
                  top: 0,
                  right: 0
                }}>Image Tool</div>
              </div>
              <div className="stat-label">
                Create beautiful CSS gradients with a visual editor
              </div>
            </Link>
            
            <Link to="/tools/text" className="card">
              <div style={{ position: 'relative' }}>
                <div style={{ marginBottom: 'var(--space-2)' }}>
                  <TextIcon />
                </div>
                <div className="card-title">Text Generator</div>
                <div className="card-badge" style={{ 
                  position: 'absolute',
                  top: 0,
                  right: 0
                }}>Image Tool</div>
              </div>
              <div className="stat-label">
                Create images with custom text overlays
              </div>
            </Link>
            
            <Link to="/tools/snake" className="card">
              <div style={{ position: 'relative' }}>
                <div style={{ marginBottom: 'var(--space-2)' }}>
                  <GameIcon />
                </div>
                <div className="card-title">Snake Game</div>
                <div className="card-badge" style={{ 
                  position: 'absolute',
                  top: 0,
                  right: 0
                }}>Game</div>
              </div>
              <div className="stat-label">
                Classic snake game with a modern twist
              </div>
            </Link>
          </div>
          
          {/* Tools Section */}
          {categories.map(category => (
            <div key={category}>
              <h2 style={{ marginTop: 'var(--space-6)' }}>{category}</h2>
              
              <div className="grid grid-5" style={{ gap: 'var(--space-3)' }}>
                {tools
                  .filter(tool => tool.category === category)
                  .map((tool) => (
                    <Link 
                      key={tool.id} 
                      to={tool.path}
                      className="tool-card"
                      style={{
                        padding: 'var(--space-3)',
                      }}
                    >
                      <div style={{ 
                        marginBottom: 'var(--space-2)',
                      }}>
                        {tool.icon}
                      </div>
                      <div className="tool-card-title" style={{ 
                        fontSize: 'var(--font-size-md)',
                        marginBottom: 'var(--space-1)'
                      }}>{tool.name}</div>
                      <div className="tool-card-description" style={{
                        fontSize: 'var(--font-size-xs)'
                      }}>{tool.description}</div>
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