import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Define a type for tool entries
type Tool = {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  category: string;
};

// Define your tools
const tools = [
  {
    id: 'gradient',
    name: 'Gradient Generator',
    description: 'Create beautiful CSS gradients with a visual editor',
    path: '/tools/gradient',
    icon: '🎨',
    category: 'Design'
  },
  // Add more tools here as you create them
];

export default function NavBar() {
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Could implement a search results page in the future
      // For now, find the first matching tool and navigate to it
      const matchedTool = tools.find(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (matchedTool) {
        navigate(matchedTool.path);
      }
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span>B</span>
        <span>BRAD'S TOOLS</span>
      </Link>
      
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
          Dashboard
        </NavLink>
        
        {/* Tools dropdown */}
        <div className="dropdown">
          <button className="dropdown-button">
            Tools <span>▼</span>
          </button>
          <div className="dropdown-menu">
            {tools.map(tool => (
              <Link
                key={tool.id}
                to={tool.path}
                className="dropdown-item"
              >
                <span className="icon">{tool.icon}</span>
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Search box */}
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search tools..." 
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '200px', 
              padding: 'var(--space-2) var(--space-3)', 
              fontSize: 'var(--font-size-sm)' 
            }}
          />
        </form>
        
        <button
          onClick={logout}
          className="button button-red"
          style={{ marginLeft: 'var(--space-4)' }}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
} 