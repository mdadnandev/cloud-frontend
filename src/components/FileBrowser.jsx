import FolderCard from './FolderCard';
import FileCard from './FileCard';
import '../styles/file-browser.css';

export default function FileBrowser({
  folders = [],
  files = [],
  viewMode = 'grid',
  loading = false,
  onFolderClick,
  onFileClick,
  onContextMenu,
  activeView = 'my-drive',
  searchQuery = '',
  onUploadClick,
  onCreateFolderClick,
}) {
  const searchSvg = (
    <svg viewBox="0 0 20 20">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M16 16l-3.3-3.3" />
    </svg>
  );

  const trashSvg = (
    <svg viewBox="0 0 20 20">
      <path d="M4 5.5h12M8 5.5V4a1 1 0 011-1h2a1 1 0 011 1v1.5M6 5.5l.7 10a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-10" />
    </svg>
  );

  const usersSvg = (
    <svg viewBox="0 0 20 20">
      <circle cx="7" cy="7" r="2.3" />
      <path d="M2.5 16c0-2.4 2-3.8 4.5-3.8s4.5 1.4 4.5 3.8" />
      <circle cx="14.3" cy="7.3" r="1.8" />
      <path d="M13 12.4c1.7.3 3 1.5 3.3 3.6" />
    </svg>
  );

  const driveSvg = (
    <svg viewBox="0 0 20 20">
      <rect x="2.5" y="7" width="15" height="9" rx="1.5" />
      <path d="M2.5 11.2h15" />
    </svg>
  );

  if (loading) {
    return (
      <div>
        <div className="section-label">Loading contents...</div>
        <div className={viewMode === 'grid' ? 'grid-view' : 'list-view'}>
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
          <div className="empty-state-icon icon">{searchSvg}</div>
          <h3>No matching results</h3>
          <p>We couldn&apos;t find any files or folders matching &ldquo;{searchQuery}&rdquo;</p>
        </div>
      );
    }

    if (activeView === 'trash') {
      return (
        <div className="empty-state">
          <div className="empty-state-icon icon">{trashSvg}</div>
          <h3>Trash is empty</h3>
          <p>Files moved to trash will appear here</p>
        </div>
      );
    }

    if (activeView === 'shared') {
      return (
        <div className="empty-state">
          <div className="empty-state-icon icon">{usersSvg}</div>
          <h3>No shared files</h3>
          <p>Files and documents shared with you by others will show up here</p>
        </div>
      );
    }

    return (
      <div className="empty-state">
        <div className="empty-state-icon icon">{driveSvg}</div>
        <h3>This folder is empty</h3>
        <p>Get started by uploading your first files or creating a new folder</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn btn-ghost" onClick={onCreateFolderClick}>
            New Folder
          </button>
          <button className="btn btn-primary" onClick={onUploadClick}>
            Upload File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="file-browser-container">
      {/* Folders Section */}
      {folders.length > 0 && (
        <>
          <p className="section-label">Folders ({folders.length})</p>
          <div className="grid-view" style={{ marginBottom: 24 }}>
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
        </>
      )}

      {/* Files Section */}
      {files.length > 0 && (
        <>
          <p className="section-label">Files ({files.length})</p>
          {viewMode === 'grid' ? (
            <div className="grid-view">
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  viewMode="grid"
                  onClick={onFileClick}
                  onContextMenu={onContextMenu}
                />
              ))}
            </div>
          ) : (
            <div className="list-view">
              <div className="list-head">
                <span />
                <span>Name</span>
                <span>Modified</span>
                <span>Size</span>
                <span />
              </div>
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  viewMode="list"
                  onClick={onFileClick}
                  onContextMenu={onContextMenu}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

