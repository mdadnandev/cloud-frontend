import { getFileExtension, getFileCategory, formatSize } from '../utils/fileUtils';

const renderFileIcon = (category) => {
  switch (category) {
    case 'image':
      return (
        <svg viewBox="0 0 20 20">
          <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
          <circle cx="7" cy="7.5" r="1.5" />
          <path d="M17.5 13.5l-4.5-4.5-5.5 5.5M7.5 14.5l-2-2-3 3" />
        </svg>
      );
    case 'video':
      return (
        <svg viewBox="0 0 20 20">
          <rect x="2.5" y="4" width="10.5" height="12" rx="1.5" />
          <path d="M13 8.5l4.5-3v9l-4.5-3v-3z" />
        </svg>
      );
    case 'audio':
      return (
        <svg viewBox="0 0 20 20">
          <path d="M7 15V5l9-2v10" />
          <circle cx="5" cy="15" r="2" />
          <circle cx="14" cy="13" r="2" />
        </svg>
      );
    case 'code':
      return (
        <svg viewBox="0 0 20 20">
          <path d="M6.5 6.5L3 10l3.5 3.5M13.5 6.5L17 10l-3.5 3.5M11.5 4.5l-3 11" />
        </svg>
      );
    case 'archive':
      return (
        <svg viewBox="0 0 20 20">
          <path d="M3 4h14v3H3zM4.5 7v9a1 1 0 001 1h9a1 1 0 001-1V7M8.5 10.5h3" />
        </svg>
      );
    case 'doc':
    default:
      return (
        <svg viewBox="0 0 20 20">
          <path d="M5.5 2.5h6l3.5 3.5v10.5a1 1 0 01-1 1h-8.5a1 1 0 01-1-1v-13a1 1 0 011-1z" />
          <path d="M11.5 2.5v3.5h3.5" />
          <path d="M7 9.5h6M7 13h4" />
        </svg>
      );
  }
};

export default function FileCard({ file, viewMode, onContextMenu, onClick }) {
  const fileName = file.originalName || file.name || file.file?.originalName || file.file?.name || 'Untitled';
  const ext = getFileExtension(fileName);
  const category = getFileCategory(file);
  const fileSize = file.size ?? file.file?.size;
  const fileDate = file.createdAt || file.file?.createdAt;
  const isShared = file.isShared || !!file.sharedBy;
  const sharedByName = file.sharedBy?.name || file.sharedBy?.email;

  const moreSvg = (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="10" cy="4.5" r="1.1" />
      <circle cx="10" cy="10" r="1.1" />
      <circle cx="10" cy="15.5" r="1.1" />
    </svg>
  );

  const iconSvg = renderFileIcon(category);

  if (viewMode === 'list') {
    return (
      <div
        className={`list-row file-category-${category}`}
        onContextMenu={(e) => onContextMenu(e, file, 'file')}
        onClick={() => onClick && onClick(file)}
      >
        <span className={`list-row-icon icon is-${category}`}>{iconSvg}</span>
        <span className="list-row-name">
          {fileName}
          {isShared && (
            <span
              style={{
                marginLeft: 8,
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '4px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              {sharedByName ? `by ${sharedByName}` : 'Shared'}
            </span>
          )}
        </span>
        <span className="list-row-date mono">
          {fileDate ? new Date(fileDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
        </span>
        <span className="list-row-size mono">{formatSize(fileSize)}</span>
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
      className={`file-card tick file-category-${category}`}
      onContextMenu={(e) => onContextMenu(e, file, 'file')}
      onClick={() => onClick && onClick(file)}
    >
      <div className="file-card-top">
        <span className={`file-card-icon icon is-${category}`}>{iconSvg}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isShared && (
            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontWeight: 500,
              }}
              title={sharedByName ? `Shared by ${sharedByName}` : 'Shared file'}
            >
              Shared
            </span>
          )}
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
      </div>
      <div className="file-card-name" title={fileName}>{fileName}</div>
      <div className="file-card-meta">
        <span className={`ext is-${category}`}>{ext}</span>
        <span className="mono">{formatSize(fileSize)}</span>
      </div>
    </div>
  );
}