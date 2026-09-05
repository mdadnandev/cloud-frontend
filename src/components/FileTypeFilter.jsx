export default function FileTypeFilter({
  activeFilter = 'all',
  onFilterChange,
  counts = { all: 0, doc: 0, image: 0, video: 0, audio: 0 },
}) {
  const filters = [
    {
      id: 'all',
      label: 'All Files',
      count: counts.all,
      icon: (
        <svg viewBox="0 0 20 20">
          <rect x="3" y="3" width="5.5" height="5.5" rx="1" />
          <rect x="11.5" y="3" width="5.5" height="5.5" rx="1" />
          <rect x="3" y="11.5" width="5.5" height="5.5" rx="1" />
          <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1" />
        </svg>
      ),
    },
    {
      id: 'doc',
      label: 'Documents',
      count: counts.doc,
      icon: (
        <svg viewBox="0 0 20 20">
          <path d="M5.5 2.5h6l3.5 3.5v10.5a1 1 0 01-1 1h-8.5a1 1 0 01-1-1v-13a1 1 0 011-1z" />
          <path d="M11.5 2.5v3.5h3.5" />
          <path d="M7 9.5h6M7 13h4" />
        </svg>
      ),
    },
    {
      id: 'image',
      label: 'Images',
      count: counts.image,
      icon: (
        <svg viewBox="0 0 20 20">
          <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
          <circle cx="7" cy="7.5" r="1.5" />
          <path d="M17.5 13.5l-4.5-4.5-5.5 5.5M7.5 14.5l-2-2-3 3" />
        </svg>
      ),
    },
    {
      id: 'video',
      label: 'Videos',
      count: counts.video,
      icon: (
        <svg viewBox="0 0 20 20">
          <rect x="2.5" y="4" width="10.5" height="12" rx="1.5" />
          <path d="M13 8.5l4.5-3v9l-4.5-3v-3z" />
        </svg>
      ),
    },
    {
      id: 'audio',
      label: 'Audio',
      count: counts.audio,
      icon: (
        <svg viewBox="0 0 20 20">
          <path d="M7 15V5l9-2v10" />
          <circle cx="5" cy="15" r="2" />
          <circle cx="14" cy="13" r="2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="file-type-filter-bar" role="tablist" aria-label="Filter files by type">
      <div className="filter-chips-list">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              id={`filter-${filter.id}`}
              className={`filter-chip ${isActive ? 'active' : ''}`}
              onClick={() => onFilterChange(filter.id)}
            >
              <span className="filter-chip-icon icon">{filter.icon}</span>
              <span className="filter-chip-label">{filter.label}</span>
              {typeof filter.count === 'number' && (
                <span className="filter-chip-count mono">{filter.count}</span>
              )}
            </button>
          );
        })}
      </div>
      {activeFilter !== 'all' && (
        <button
          type="button"
          className="filter-clear-btn"
          onClick={() => onFilterChange('all')}
          title="Reset filter"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}
