import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  BarChart3,
  Settings,
  X
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Farms', href: '/farms', icon: MapPin },
    { name: 'Plots', href: '/plots', icon: BarChart3 },
    { name: 'Sensor Data', href: '/sensor-data', icon: Activity },
    { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-content">
        {/* Mobile close button */}
        <div className="sidebar-header">
          <button 
            className="sidebar-close-button"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
                onClick={onClose} // Close sidebar when navigating on mobile
              >
                <Icon className="nav-icon" size={20} />
                <span className="nav-text">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
