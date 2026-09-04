export default function Breadcrumb({ path = [], onNavigate }) {
  const homeIcon = (
    <svg viewBox="0 0 20 20">
      <path d="M3 9.5 10 3l7 6.5M5 8v8h10V8" />
    </svg>
  );

  return (
    <div className="crumb">
      <span
        className="icon"
        style={{ width: 15, height: 15, color: 'var(--graphite)' }}
        onClick={() => onNavigate(null)}
      >
        {homeIcon}
      </span>
      <span
        className={path.length === 0 ? 'current' : ''}
        onClick={() => onNavigate(null)}
      >
        My Drive
      </span>
      {path.map((folder, i) => (
        <span key={folder.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span className="sep">/</span>
          <span
            className={i === path.length - 1 ? 'current' : ''}
            onClick={() => i < path.length - 1 && onNavigate(folder.id)}
          >
            {folder.name}
          </span>
        </span>
      ))}
    </div>
  );
}

