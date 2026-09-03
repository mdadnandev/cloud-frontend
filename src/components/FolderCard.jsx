import { Folder } from 'lucide-react';
import { MoreVertical } from 'lucide-react';

export default function FolderCard({ folder, viewMode, onClick, onContextMenu }) {
  if (viewMode === 'list') {
    return (
      <div
        className="file-list-row"
        onClick={() => onClick(folder)}
        onContextMenu={(e) => onContextMenu(e, folder, 'folder')}
      >
        <div className="file-list-icon" style={{ background: 'rgba(59, 130, 246, 0.08)' }}>
          <Folder size={18} color="var(--accent-primary)" />
        </div>
        <span className="file-list-name">{folder.name}</span>
        <span className="file-list-date">
          {folder.createdAt ? new Date(folder.createdAt).toLocaleDateString() : '—'}
        </span>
        <span className="file-list-size">—</span>
        <button
          className="btn-icon"
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, folder, 'folder');
          }}
        >
          <MoreVertical size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="file-card folder-card"
      onClick={() => onClick(folder)}
      onContextMenu={(e) => onContextMenu(e, folder, 'folder')}
    >
      <button
        className="file-card-more"
        onClick={(e) => {
          e.stopPropagation();
          onContextMenu(e, folder, 'folder');
        }}
      >
        <MoreVertical size={14} />
      </button>
      <div className="file-card-icon">
        <Folder size={40} />
      </div>
      <div className="file-card-name">{folder.name}</div>
      <div className="file-card-meta">
        <span>{folder.createdAt ? new Date(folder.createdAt).toLocaleDateString() : ''}</span>
      </div>
    </div>
  );
}
