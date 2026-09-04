import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

export default function Sidebar({ activeView, onViewChange, onUploadClick, isOpen, onClose }) {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'MK';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className={`rail-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`rail ${isOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="rail-brand">
          <div className="auth-mark icon" style={{ width: 28, height: 28 }}>
            <svg viewBox="0 0 20 20">
              <path d="M2.5 6.5 10 2.5l7.5 4v7l-7.5 4-7.5-4z" />
              <path d="M2.5 6.5 10 10.5l7.5-4M10 10.5v7" />
            </svg>
          </div>
          <span>Crate</span>
        </div>

        {/* Upload Action */}
        <div className="rail-upload">
          <button className="btn btn-primary btn-block" onClick={onUploadClick} id="sidebar-upload-btn">
            <span className="icon">
              <svg viewBox="0 0 20 20">
                <path d="M10 4v9M6.5 8.5L10 5l3.5 3.5M4 15.5h12" />
              </svg>
            </span>
            Upload files
          </button>
          <div className="rail-upload-hint">Up to 100 MB per file</div>
        </div>

        {/* Nav Items */}
        <nav className="rail-nav">
          <div className="rail-group-label">Library</div>
          <button
            id="nav-my-drive"
            className={`rail-item ${activeView === 'my-drive' ? 'active' : ''}`}
            onClick={() => {
              onViewChange('my-drive');
              onClose();
            }}
          >
            <span className="icon">
              <svg viewBox="0 0 20 20">
                <rect x="2.5" y="7" width="15" height="9" rx="1.5" />
                <path d="M2.5 11.2h15" />
                <circle cx="6.5" cy="13.6" r=".6" fill="currentColor" stroke="none" />
                <circle cx="9.3" cy="13.6" r=".6" fill="currentColor" stroke="none" />
              </svg>
            </span>
            My Drive
          </button>

          <button
            id="nav-shared"
            className={`rail-item ${activeView === 'shared' ? 'active' : ''}`}
            onClick={() => {
              onViewChange('shared');
              onClose();
            }}
          >
            <span className="icon">
              <svg viewBox="0 0 20 20">
                <circle cx="7" cy="7" r="2.3" />
                <path d="M2.5 16c0-2.4 2-3.8 4.5-3.8s4.5 1.4 4.5 3.8" />
                <circle cx="14.3" cy="7.3" r="1.8" />
                <path d="M13 12.4c1.7.3 3 1.5 3.3 3.6" />
              </svg>
            </span>
            Shared with me
            <span className="count">3</span>
          </button>

          <div className="rail-group-label">Manage</div>
          <button
            id="nav-trash"
            className={`rail-item ${activeView === 'trash' ? 'active' : ''}`}
            onClick={() => {
              onViewChange('trash');
              onClose();
            }}
          >
            <span className="icon">
              <svg viewBox="0 0 20 20">
                <path d="M4 5.5h12M8 5.5V4a1 1 0 011-1h2a1 1 0 011 1v1.5M6 5.5l.7 10a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-10" />
              </svg>
            </span>
            Trash
          </button>
        </nav>

        {/* Storage Bar */}
        <div className="rail-storage">
          <div className="rail-storage-label">Storage</div>
          <div className="rail-storage-bar">
            <div className="rail-storage-fill" style={{ width: '63%' }} />
          </div>
          <div className="rail-storage-text">
            <span className="mono">12.6 GB</span> of <span className="mono">20 GB</span> used
          </div>
        </div>

        {/* User Profile */}
        <div className="rail-profile">
          <div className="avatar">{getInitials(user?.name || user?.email)}</div>
          <div className="profile-info">
            <div className="name">{user?.name || 'Maya Kessler'}</div>
            <div className="email">{user?.email || 'maya@studio.com'}</div>
          </div>
          <span
            className="icon"
            title="Sign out"
            onClick={logout}
            style={{ cursor: 'pointer' }}
            id="logout-btn"
          >
            <svg viewBox="0 0 20 20">
              <path d="M8 17H4.5a1 1 0 01-1-1V4a1 1 0 011-1H8M13 14l4-4-4-4M17 10H7.5" />
            </svg>
          </span>
        </div>
      </aside>
    </>
  );
}

