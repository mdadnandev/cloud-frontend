import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/* ---------- sample data — swap for your real API calls ---------- */
const FOLDERS = [
  { id: 'f1', name: 'Client decks', count: '8 items' },
  { id: 'f2', name: 'Brand assets', count: '23 items' },
  { id: 'f3', name: 'Archive 2025', count: '146 items' },
  { id: 'f4', name: 'Contracts', count: '12 items' },
];
const FILES = [
  { id: 'd1', name: 'Q3-roadmap.fig', ext: 'FIG', size: '18.2 MB', date: 'Sep 3' },
  { id: 'd2', name: 'site-mockup-v4.png', ext: 'PNG', size: '6.4 MB', date: 'Sep 2' },
  { id: 'd3', name: 'budget-2026.xlsx', ext: 'XLSX', size: '340 KB', date: 'Sep 1' },
  { id: 'd4', name: 'kickoff-notes.docx', ext: 'DOCX', size: '88 KB', date: 'Aug 29' },
  { id: 'd5', name: 'hero-render.mp4', ext: 'MP4', size: '112 MB', date: 'Aug 27' },
  { id: 'd6', name: 'logo-final.svg', ext: 'SVG', size: '24 KB', date: 'Aug 24' },
];

/* ---------- icons ---------- */
const FolderIcon = () => <svg viewBox="0 0 20 20"><path d="M2.5 5.5A1.5 1.5 0 014 4h3.6l1.4 1.8h7.1A1.5 1.5 0 0117.5 7.3v7.2A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5z"/></svg>;
const DocIcon = () => <svg viewBox="0 0 20 20"><path d="M5.5 2.5h6l3 3v11a1 1 0 01-1 1h-8a1 1 0 01-1-1v-13a1 1 0 011-1z"/><path d="M11.5 2.5v3h3"/></svg>;
const MoreIcon = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="10" cy="4.5" r="1.1"/><circle cx="10" cy="10" r="1.1"/><circle cx="10" cy="15.5" r="1.1"/></svg>;
const UploadIcon = () => <svg viewBox="0 0 20 20"><path d="M10 13V4M6.5 7.5L10 4l3.5 3.5M4 15.5h12"/></svg>;
const FolderPlusIcon = () => <svg viewBox="0 0 20 20"><path d="M2.5 5.5A1.5 1.5 0 014 4h3.6l1.4 1.8h7.1A1.5 1.5 0 0117.5 7.3v7.2A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5z"/><path d="M10 8.5v4M8 10.5h4"/></svg>;
const RefreshIcon = () => <svg viewBox="0 0 20 20"><path d="M16 5.5v3.5h-3.5M4 14.5V11h3.5"/><path d="M15.3 8.5A5.5 5.5 0 105.2 12M4.7 11.5A5.5 5.5 0 0114.8 8"/></svg>;
const RenameIcon = () => <svg viewBox="0 0 20 20"><path d="M4 13.5V16h2.5l7.4-7.4-2.5-2.5z"/><path d="M12.5 4.5l3 3"/></svg>;
const ShareIcon = () => <svg viewBox="0 0 20 20"><path d="M8 12l4-4M7.5 13.5l-1.7 1.7a2.6 2.6 0 01-3.7-3.7L5.8 7.8a2.6 2.6 0 013.7 0M12.5 6.5l1.7-1.7a2.6 2.6 0 013.7 3.7L14.2 12.2a2.6 2.6 0 01-3.7 0"/></svg>;
const DownloadIcon = () => <svg viewBox="0 0 20 20"><path d="M10 13V3M6.5 9.5L10 13l3.5-3.5M4 15.5h12"/></svg>;
const TrashIcon = () => <svg viewBox="0 0 20 20"><path d="M4 5.5h12M8 5.5V4a1 1 0 011-1h2a1 1 0 011 1v1.5M6 5.5l.7 10a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-10"/></svg>;

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [railOpen, setRailOpen] = useState(false);
  const [view, setView] = useState('grid');
  const [menu, setMenu] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest('.menu') && !e.target.closest('.menu-trigger')) setMenu(null);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setMenu(null); setShareTarget(null); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const openMenu = (e, item) => {
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    setMenu({ top: r.bottom + window.scrollY + 6, left: Math.min(r.left + window.scrollX, window.innerWidth - 200), item });
  };

  return (
    <div className="app-shell">
      {railOpen && <div className="rail-overlay open" onClick={() => setRailOpen(false)} />}
      <Sidebar open={railOpen} user={user} onLogout={logout} />

      <main className="app-main">
        <header className="app-header">
          <button className="header-menu-btn" onClick={() => setRailOpen(true)} aria-label="Open menu">
            <span className="icon"><svg viewBox="0 0 20 20"><path d="M3 5h14M3 10h14M3 15h14"/></svg></span>
          </button>
          <div className="search">
            <span className="icon"><svg viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M16 16l-3.3-3.3"/></svg></span>
            <input type="text" placeholder="Search files and folders" />
          </div>
          <div className="header-actions">
            <div className="view-toggle">
              <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} aria-label="Grid view">
                <span className="icon" style={{ width: 15, height: 15 }}><svg viewBox="0 0 20 20"><rect x="2.5" y="2.5" width="6" height="6" rx="1"/><rect x="11.5" y="2.5" width="6" height="6" rx="1"/><rect x="2.5" y="11.5" width="6" height="6" rx="1"/><rect x="11.5" y="11.5" width="6" height="6" rx="1"/></svg></span>
              </button>
              <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} aria-label="List view">
                <span className="icon" style={{ width: 15, height: 15 }}><svg viewBox="0 0 20 20"><path d="M3 5h14M3 10h14M3 15h14"/></svg></span>
              </button>
            </div>
          </div>
        </header>

        <div className="app-content">
          <div className="crumb">
            <span className="icon" style={{ width: 15, height: 15, color: 'var(--graphite)' }}>
              <svg viewBox="0 0 20 20"><path d="M3 9.5 10 3l7 6.5M5 8v8h10V8"/></svg>
            </span>
            <span className="current">My Drive</span>
          </div>

          <div className="content-head">
            <div>
              <h1>My Drive</h1>
              <div className="sub">{FOLDERS.length + FILES.length} items · updated today</div>
            </div>
            <div className="content-actions">
              <button className="btn btn-ghost"><span className="icon"><FolderPlusIcon /></span>New folder</button>
              <button className="btn btn-primary"><span className="icon"><UploadIcon /></span>Upload</button>
              <button className="btn btn-ghost btn-icon" aria-label="Refresh"><span className="icon"><RefreshIcon /></span></button>
            </div>
          </div>

          <p className="section-label">Folders ({FOLDERS.length})</p>
          <div className="grid-view">
            {FOLDERS.map((f) => (
              <div className="file-card folder-card tick" key={f.id}>
                <div className="file-card-top">
                  <span className="file-card-icon icon"><FolderIcon /></span>
                  <button className="file-card-more menu-trigger" onClick={(e) => openMenu(e, f)} aria-label="More options"><MoreIcon /></button>
                </div>
                <div className="file-card-name">{f.name}</div>
                <div className="file-card-meta"><span>{f.count}</span></div>
              </div>
            ))}
          </div>

          <p className="section-label">Files ({FILES.length})</p>

          {view === 'grid' ? (
            <div className="grid-view">
              {FILES.map((f) => (
                <div className="file-card tick" key={f.id}>
                  <div className="file-card-top">
                    <span className="file-card-icon icon"><DocIcon /></span>
                    <button className="file-card-more menu-trigger" onClick={(e) => openMenu(e, f)} aria-label="More options"><MoreIcon /></button>
                  </div>
                  <div className="file-card-name">{f.name}</div>
                  <div className="file-card-meta"><span className="ext">{f.ext}</span><span className="mono">{f.size}</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="list-view">
              <div className="list-head"><span></span><span>Name</span><span>Modified</span><span>Size</span><span></span></div>
              {FILES.map((f) => (
                <div className="list-row" key={f.id}>
                  <span className="list-row-icon icon"><DocIcon /></span>
                  <span className="list-row-name">{f.name}</span>
                  <span className="list-row-date mono">{f.date}</span>
                  <span className="list-row-size mono">{f.size}</span>
                  <button className="list-row-more menu-trigger" onClick={(e) => openMenu(e, f)} aria-label="More options"><MoreIcon /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {menu && (
        <div className="menu open" style={{ top: menu.top, left: menu.left }}>
          <button className="menu-item"><span className="icon" style={{ width: 15, height: 15 }}><RenameIcon /></span>Rename</button>
          <button className="menu-item" onClick={() => { setShareTarget(menu.item); setMenu(null); }}>
            <span className="icon" style={{ width: 15, height: 15 }}><ShareIcon /></span>Share
          </button>
          <button className="menu-item"><span className="icon" style={{ width: 15, height: 15 }}><DownloadIcon /></span>Download</button>
          <button className="menu-item"><span className="icon" style={{ width: 15, height: 15 }}><FolderIcon /></span>Move to</button>
          <div className="menu-divider" />
          <button className="menu-item danger"><span className="icon" style={{ width: 15, height: 15 }}><TrashIcon /></span>Delete</button>
        </div>
      )}

      {shareTarget && <ShareModal item={shareTarget} onClose={() => setShareTarget(null)} />}
    </div>
  );
}

/* ---------- Sidebar ---------- */
function Sidebar({ open, user, onLogout }) {
  const initials = (name) => (name ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() : '·');

  return (
    <aside className={`rail ${open ? 'open' : ''}`}>
      <div className="rail-brand">
        <div className="auth-mark icon" style={{ width: 28, height: 28 }}>
          <svg viewBox="0 0 20 20"><path d="M2.5 6.5 10 2.5l7.5 4v7l-7.5 4-7.5-4z"/><path d="M2.5 6.5 10 10.5l7.5-4M10 10.5v7"/></svg>
        </div>
        <span>Crate</span>
      </div>

      <div className="rail-upload">
        <button className="btn btn-primary btn-block"><span className="icon"><UploadIcon /></span>Upload files</button>
        <div className="rail-upload-hint">Up to 100 MB per file</div>
      </div>

      <nav className="rail-nav">
        <div className="rail-group-label">Library</div>
        <button className="rail-item active">
          <span className="icon"><svg viewBox="0 0 20 20"><rect x="2.5" y="7" width="15" height="9" rx="1.5"/><path d="M2.5 11.2h15"/><circle cx="6.5" cy="13.6" r=".6" fill="currentColor" stroke="none"/><circle cx="9.3" cy="13.6" r=".6" fill="currentColor" stroke="none"/></svg></span>
          My Drive
        </button>
        <button className="rail-item">
          <span className="icon"><svg viewBox="0 0 20 20"><circle cx="7" cy="7" r="2.3"/><path d="M2.5 16c0-2.4 2-3.8 4.5-3.8s4.5 1.4 4.5 3.8"/><circle cx="14.3" cy="7.3" r="1.8"/><path d="M13 12.4c1.7.3 3 1.5 3.3 3.6"/></svg></span>
          Shared with me<span className="count">3</span>
        </button>
        <div className="rail-group-label">Manage</div>
        <button className="rail-item">
          <span className="icon"><TrashIcon /></span>
          Trash
        </button>
      </nav>

      <div className="rail-storage">
        <div className="rail-storage-label">Storage</div>
        <div className="rail-storage-bar"><div className="rail-storage-fill" style={{ width: '63%' }} /></div>
        <div className="rail-storage-text"><span className="mono">12.6 GB</span> of <span className="mono">20 GB</span> used</div>
      </div>

      <div className="rail-profile">
        <div className="avatar">{initials(user?.name)}</div>
        <div className="profile-info">
          <div className="name">{user?.name || 'Your name'}</div>
          <div className="email">{user?.email || ''}</div>
        </div>
        <span className="icon" title="Sign out" onClick={onLogout} style={{ cursor: 'pointer' }}>
          <svg viewBox="0 0 20 20"><path d="M8 17H4.5a1 1 0 01-1-1V4a1 1 0 011-1H8M13 14l4-4-4-4M17 10H7.5"/></svg>
        </span>
      </div>
    </aside>
  );
}

/* ---------- Share modal ---------- */
function ShareModal({ item, onClose }) {
  const [expiry, setExpiry] = useState('30');
  const [copied, setCopied] = useState(false);
  const slug = item.name.toLowerCase().replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]+/g, '-');
  const link = `crate.app/s/${slug}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h2>Share "{item.name}"</h2>
            <p>Anyone with the link can access it, based on the permission below.</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <span className="icon"><svg viewBox="0 0 20 20"><path d="M5 5l10 10M15 5L5 15"/></svg></span>
          </button>
        </div>

        <div className="modal-form">
          <label className="field">
            <span>Permission</span>
            <select defaultValue="view">
              <option value="view">Can view</option>
              <option value="comment">Can comment</option>
              <option value="edit">Can edit</option>
            </select>
          </label>

          <div className="field">
            <span>Link expires</span>
            <div className="expiry-options">
              {['7', '30', 'never'].map((v) => (
                <button key={v} type="button" className={`expiry-option ${expiry === v ? 'active' : ''}`} onClick={() => setExpiry(v)}>
                  {v === 'never' ? 'Never' : `${v} days`}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span>Shareable link</span>
            <div className="link-row">
              <input type="text" readOnly value={link} />
              <button className="btn btn-ghost copy-btn" onClick={copyLink}>
                <span className="icon"><svg viewBox="0 0 20 20"><rect x="7" y="7" width="9" height="9" rx="1.5"/><path d="M4.5 12.5H4a1 1 0 01-1-1V4a1 1 0 011-1h7a1 1 0 011 1v.5"/></svg></span>
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}