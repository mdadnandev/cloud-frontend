import FolderCard from './FolderCard';
import FileCard from './FileCard';
import { HardDrive, FolderPlus, Upload, Users, Trash2, SearchX } from 'lucide-react';
import '../styles/file-browser.css';

export default function FileBrowser({
  folders = [],
  files = [],
  viewMode = 'grid',
  loading = false,
  onFolderClick,
  onContextMenu,
  activeView = 'my-drive',
  searchQuery = '',
  onUploadClick,
  onCreateFolderClick,
}) {
  if (loading) {
    return (
      <div>
        <div className="section-label">Loading contents...</div>
        <div className={viewMode === 'grid' ? 'file-grid' : 'file-list'}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className={`skeleton ${viewMode === 'grid' ? 'skeleton-card' : 'skeleton-row'}`}
            />
          ))}
        </div>
      </div>
    );
  }

  const hasItems = folders.length > 0 || files.length > 0;

  if (!hasItems) {
    if (searchQuery) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">
            <SearchX size={36} />
          </div>
          <h3>No matching results</h3>
          <p>We couldn&apos;t find any files or folders matching &ldquo;{searchQuery}&rdquo;</p>
        </div>
      );
    }

    if (activeView === 'trash') {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Trash2 size={36} />
          </div>
          <h3>Trash is empty</h3>
          <p>Files moved to trash will appear here</p>
        </div>
      );
    }

    if (activeView === 'shared') {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Users size={36} />
          </div>
          <h3>No shared files</h3>
          <p>Files and documents shared with you by others will show up here</p>
        </div>
      );
    }

    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <HardDrive size={36} />
        </div>
        <h3>This folder is empty</h3>
        <p>Get started by uploading your first files or creating a new folder</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <button className="btn btn-secondary" onClick={onCreateFolderClick}>
            <FolderPlus size={16} />
            New Folder
          </button>
          <button className="btn btn-primary" onClick={onUploadClick}>
            <Upload size={16} />
            Upload File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="file-browser-container stagger-in">
      {/* Folders Section */}
      {folders.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div className="section-label">Folders ({folders.length})</div>
          <div className={viewMode === 'grid' ? 'file-grid' : 'file-list'}>
            {viewMode === 'list' && (
              <div className="file-list-header">
                <span />
                <span>Name</span>
                <span>Created</span>
                <span>Size</span>
                <span />
              </div>
            )}
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                viewMode={viewMode}
                onClick={onFolderClick}
                onContextMenu={onContextMenu}
              />
            ))}
          </div>
        </div>
      )}

      {/* Files Section */}
      {files.length > 0 && (
        <div>
          <div className="section-label">Files ({files.length})</div>
          <div className={viewMode === 'grid' ? 'file-grid' : 'file-list'}>
            {viewMode === 'list' && folders.length === 0 && (
              <div className="file-list-header">
                <span />
                <span>Name</span>
                <span>Modified</span>
                <span>Size</span>
                <span />
              </div>
            )}
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                viewMode={viewMode}
                onContextMenu={onContextMenu}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
