import { useState, useEffect, useRef } from 'react';
import { Search, LayoutGrid, List, Menu } from 'lucide-react';
import '../styles/dashboard.css';

export default function Header({ viewMode, onViewModeChange, onSearch, onMenuClick }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Keyboard shortcut: Ctrl+K to focus search
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
    <header className="dashboard-header">
      <button className="header-menu-btn" onClick={onMenuClick} id="menu-btn">
        <Menu size={20} />
      </button>

      <div className="header-search">
        <Search className="header-search-icon" size={16} />
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          className="header-search-input"
          placeholder="Search files and folders..."
          value={query}
          onChange={handleSearch}
        />
        <span className="header-search-shortcut">Ctrl+K</span>
      </div>

      <div className="header-actions">
        <div className="header-view-toggle">
          <button
            id="view-grid"
            className={`header-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            id="view-list"
            className={`header-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
