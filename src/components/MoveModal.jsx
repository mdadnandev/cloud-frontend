import { useState, useEffect } from 'react';
import { X, FolderInput, Folder, Home } from 'lucide-react';
import { fileAPI, folderAPI } from '../api/axios';

export default function MoveModal({ item, onClose, onMoved, availableFolders = [] }) {
  const [folders, setFolders] = useState(availableFolders);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (availableFolders.length === 0) {
      setFetching(true);
      folderAPI
        .listFolders(null)
        .then((res) => {
          setFolders(res.data || []);
        })
        .catch(() => {
          // Gracefully fallback to empty list
          setFolders([]);
        })
        .finally(() => setFetching(false));
    }
  }, [availableFolders]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const targetId = item?.id || item?.file?.id;
      await fileAPI.move(targetId, selectedFolderId);
      onMoved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to move file');
    } finally {
      setLoading(false);
    }
  };

  const displayName = item?.originalName || item?.name || item?.file?.originalName || 'item';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <FolderInput size={18} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--accent-primary)' }} />
            Move &ldquo;{displayName}&rdquo;
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Select target destination folder:
          </div>

          <div
            style={{
              maxHeight: 220,
              overflowY: 'auto',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              background: 'var(--bg-tertiary)',
            }}
          >
            {/* Root folder option */}
            <div
              onClick={() => setSelectedFolderId(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: selectedFolderId === null ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: selectedFolderId === null ? 'var(--accent-primary)' : 'var(--text-primary)',
                fontWeight: selectedFolderId === null ? 600 : 400,
                transition: 'all var(--transition-fast)',
              }}
            >
              <Home size={16} />
              <span>Root (My Drive)</span>
            </div>

            {fetching ? (
              <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                Loading folders...
              </div>
            ) : folders.length === 0 ? (
              <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                No subfolders available
              </div>
            ) : (
              folders
                .filter((f) => f.id !== item.id)
                .map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => setSelectedFolderId(folder.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      background: selectedFolderId === folder.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                      color: selectedFolderId === folder.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                      fontWeight: selectedFolderId === folder.id ? 600 : 400,
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Folder size={16} color="var(--accent-primary)" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {folder.name}
                    </span>
                  </div>
                ))
            )}
          </div>

          {error && <div style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button id="move-submit" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <div className="spinner" /> : 'Move Here'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
