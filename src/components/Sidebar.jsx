import { Cloud, HardDrive, Users, Trash2, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

export default function Sidebar({ activeView, onViewChange, onUploadClick, isOpen, onClose }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'my-drive', label: 'My Drive', icon: HardDrive },
    { id: 'shared', label: 'Shared with Me', icon: Users },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Cloud size={20} color="white" />
          </div>
          <h2>CloudDrive</h2>
        </div>

        {/* Upload button */}
        <div className="sidebar-upload">
          <button className="sidebar-upload-btn" onClick={onUploadClick} id="sidebar-upload-btn">
            <Plus size={18} />
            New Upload
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Browse</div>
          {navItems.map(item => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`sidebar-nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => {
                onViewChange(item.id);
                onClose();
              }}
            >
              <item.icon />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Storage */}
        <div className="sidebar-storage">
          <div className="sidebar-storage-label">Storage</div>
          <div className="sidebar-storage-bar">
            <div className="sidebar-storage-fill" style={{ width: '24%' }} />
          </div>
          <div className="sidebar-storage-text">2.4 GB of 10 GB used</div>
        </div>

        {/* Profile */}
        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            {getInitials(user?.name || user?.email)}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div className="sidebar-user-email">{user?.email || ''}</div>
          </div>
          <button className="sidebar-logout-btn" onClick={logout} title="Sign out" id="logout-btn">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
