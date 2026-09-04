export default function FolderCard({ folder, viewMode, onClick, onContextMenu }) {
  const folderSvg = (
    <svg viewBox="0 0 20 20">
      <path d="M2.5 5.5A1.5 1.5 0 014 4h3.6l1.4 1.8h7.1A1.5 1.5 0 0117.5 7.3v7.2A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5z" />
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
        className="list-row is-folder"
        onClick={() => onClick(folder)}
        onContextMenu={(e) => onContextMenu(e, folder, 'folder')}
      >
        <span className="list-row-icon icon">{folderSvg}</span>
        <span className="list-row-name">{folder.name}</span>
        <span className="list-row-date mono">
          {folder.createdAt ? new Date(folder.createdAt).toLocaleDateString() : '—'}
        </span>
        <span className="list-row-size mono">—</span>
        <button
          className="list-row-more menu-trigger"
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, folder, 'folder');
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
      className="file-card folder-card tick"
      onClick={() => onClick(folder)}
      onContextMenu={(e) => onContextMenu(e, folder, 'folder')}
    >
      <div className="file-card-top">
        <span className="file-card-icon icon">{folderSvg}</span>
        <button
          className="file-card-more menu-trigger"
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, folder, 'folder');
          }}
          aria-label="More options"
        >
          <span className="icon" style={{ width: 14, height: 14 }}>
            {moreSvg}
          </span>
        </button>
      </div>
      <div className="file-card-name">{folder.name}</div>
      <div className="file-card-meta">
        <span>{folder.itemCount || '0 items'}</span>
      </div>
    </div>
  );
}

