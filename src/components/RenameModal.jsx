import { useState } from 'react';
import { X, Pencil } from 'lucide-react';
import { fileAPI } from '../api/axios';

export default function RenameModal({ item, onClose, onRenamed }) {
  const [name, setName] = useState(item?.originalName || item?.name || item?.file?.originalName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const targetId = item?.id || item?.file?.id;
      await fileAPI.rename(targetId, name.trim());
      onRenamed();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to rename');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Pencil size={18} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--accent-primary)' }} />
            Rename
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label>New Name</label>
            <input
              id="rename-input"
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              onFocus={(e) => {
                // Select filename without extension
                const dotIndex = e.target.value.lastIndexOf('.');
                if (dotIndex > 0) {
                  e.target.setSelectionRange(0, dotIndex);
                } else {
                  e.target.select();
                }
              }}
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
              id="rename-submit"
              type="submit"
              className="btn btn-primary"
              disabled={loading || !name.trim()}
            >
              {loading ? <div className="spinner" /> : 'Rename'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
