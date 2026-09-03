import { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { folderAPI } from '../api/axios';

export default function CreateFolderModal({ parentId, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      await folderAPI.create({ name: name.trim(), parentId: parentId || null });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <FolderPlus size={18} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--accent-primary)' }} />
            New Folder
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label>Folder Name</label>
            <input
              id="folder-name-input"
              type="text"
              className="input-field"
              placeholder="Untitled folder"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {error && (
            <div style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{error}</div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              id="create-folder-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading || !name.trim()}
            >
              {loading ? <div className="spinner" /> : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
