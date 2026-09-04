import { useState, useEffect, useRef } from 'react';
import '../styles/dashboard.css';

export default function Header({ viewMode, onViewModeChange, onSearch, onMenuClick }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  return (
    <header className="app-header">
      <button className="header-menu-btn" onClick={onMenuClick} id="menu-btn" aria-label="Open menu">
        <span className="icon">
          <svg viewBox="0 0 20 20">
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </span>
      </button>

      <div className="search">
        <span className="icon">
          <svg viewBox="0 0 20 20">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="M16 16l-3.3-3.3" />
          </svg>
        </span>
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          placeholder="Search files and folders"
          value={query}
          onChange={handleSearch}
        />
      </div>

      <div className="header-actions">
        <div className="view-toggle">
          <button
            id="view-grid"
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
          >
            <span className="icon" style={{ width: 15, height: 15 }}>
              <svg viewBox="0 0 20 20">
                <rect x="2.5" y="2.5" width="6" height="6" rx="1" />
                <rect x="11.5" y="2.5" width="6" height="6" rx="1" />
                <rect x="2.5" y="11.5" width="6" height="6" rx="1" />
                <rect x="11.5" y="11.5" width="6" height="6" rx="1" />
              </svg>
            </span>
          </button>
          <button
            id="view-list"
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
          >
            <span className="icon" style={{ width: 15, height: 15 }}>
              <svg viewBox="0 0 20 20">
                <path d="M3 5h14M3 10h14M3 15h14" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

