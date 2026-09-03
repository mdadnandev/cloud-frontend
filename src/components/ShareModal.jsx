import { useState } from 'react';
import { X, Share2 } from 'lucide-react';
import { shareAPI } from '../api/axios';
import '../styles/modals.css';

export default function ShareModal({ file, onClose }) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('VIEWER');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await shareAPI.share({
        fileId: file.id,
        targetEmail: email.trim(),
        permission,
      });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to share file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Share2 size={18} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--accent-primary)' }} />
            Share &ldquo;{file?.originalName}&rdquo;
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              id="share-email"
              type="email"
              className="input-field"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div className="input-group">
            <label>Permission</label>
            <select
              id="share-permission"
              className="permission-select"
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
            >
              <option value="VIEWER">Viewer — can view only</option>
              <option value="EDITOR">Editor — can edit</option>
            </select>
          </div>

          {error && (
            <div style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{error}</div>
          )}

          {success && (
            <div style={{ color: 'var(--success)', fontSize: '0.8rem' }}>
              ✓ File shared successfully!
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Done
            </button>
            <button
              id="share-submit"
              type="submit"
              className="btn btn-primary"
              disabled={loading || !email.trim()}
            >
              {loading ? <div className="spinner" /> : 'Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
