import { useState } from 'react';
import { X, Link, Copy, Check, Lock } from 'lucide-react';
import { publicLinkAPI } from '../api/axios';
import '../styles/modals.css';

export default function PublicLinkModal({ file, onClose }) {
  const [permission, setPermission] = useState('VIEWER');
  const [expiryDays, setExpiryDays] = useState(7);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const expiryOptions = [
    { label: '1 Day', value: 1 },
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 },
  ];

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await publicLinkAPI.create({
        fileId: file?.id || file?.file?.id,
        permission,
        expiryDays,
        password: password || null,
      });
      // Generate a shareable URL from the token
      const token = res.data.token;
      setLink(`${window.location.origin}/public/${token}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayName = file?.originalName || file?.name || file?.file?.originalName || 'file';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Link size={18} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--accent-primary)' }} />
            Public Link
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-form">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
            Create a shareable link for <strong style={{ color: 'var(--text-primary)' }}>{displayName}</strong>
          </div>

          <div className="input-group">
            <label>Expiry</label>
            <div className="expiry-options">
              {expiryOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`expiry-option ${expiryDays === opt.value ? 'active' : ''}`}
                  onClick={() => setExpiryDays(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Permission</label>
            <select
              className="permission-select"
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
            >
              <option value="VIEWER">Viewer</option>
              <option value="EDITOR">Editor</option>
            </select>
          </div>

          <div className="input-group">
            <label>
              <Lock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              Password (optional)
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Leave blank for no password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{error}</div>
          )}

          {link ? (
            <div className="public-link-result">
              <div className="public-link-url">{link}</div>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ) : (
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={loading}
              >
                {loading ? <div className="spinner" /> : 'Generate Link'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
