const getFileExtension = (name) => {
  if (!name) return 'FILE';
  const parts = name.split('.');
  return parts.length > 1 ? parts.pop().toUpperCase() : 'FILE';
};

const formatSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export default function FileCard({ file, viewMode, onContextMenu }) {
  const fileName = file.originalName || file.name || 'Untitled';
  const ext = getFileExtension(fileName);

  const docSvg = (
    <svg viewBox="0 0 20 20">
      <path d="M5.5 2.5h6l3 3v11a1 1 0 01-1 1h-8a1 1 0 01-1-1v-13a1 1 0 011-1z" />
      <path d="M11.5 2.5v3h3" />
    </svg>
  );

  const moreSvg = (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="10" cy="4.5" r="1.1" />
      <circle cx="10" cy="10" r="1.1" />
      <circle cx="10" cy="15.5" r="1.1" />
    </svg>
  );

  if (viewMode === 'list') {
    return (
      <div
        className="list-row"
        onContextMenu={(e) => onContextMenu(e, file, 'file')}
      >
        <span className="list-row-icon icon">{docSvg}</span>
        <span className="list-row-name">{fileName}</span>
        <span className="list-row-date mono">
          {file.createdAt ? new Date(file.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
        </span>
        <span className="list-row-size mono">{formatSize(file.size)}</span>
        <button
          className="list-row-more menu-trigger"
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, file, 'file');
          }}
          aria-label="More options"
        >
          <span className="icon" style={{ width: 14, height: 14 }}>
            {moreSvg}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="file-card tick"
      onContextMenu={(e) => onContextMenu(e, file, 'file')}
    >
      <div className="file-card-top">
        <span className="file-card-icon icon">{docSvg}</span>
        <button
          className="file-card-more menu-trigger"
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, file, 'file');
          }}
          aria-label="More options"
        >
          <span className="icon" style={{ width: 14, height: 14 }}>
            {moreSvg}
          </span>
        </button>
      </div>
      <div className="file-card-name">{fileName}</div>
      <div className="file-card-meta">
        <span className="ext">{ext}</span>
        <span className="mono">{formatSize(file.size)}</span>
      </div>
    </div>
  );
}

