import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ path, onNavigate }) {
  // path is an array of { id, name } objects representing folder hierarchy
  return (
    <div className="breadcrumb">
      <span
        className={`breadcrumb-item ${path.length === 0 ? 'active' : ''}`}
        onClick={() => onNavigate(null)}
      >
        <Home size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
        My Drive
      </span>
      {path.map((folder, i) => (
        <span key={folder.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span
            className={`breadcrumb-item ${i === path.length - 1 ? 'active' : ''}`}
            onClick={() => i < path.length - 1 && onNavigate(folder.id)}
          >
            {folder.name}
          </span>
        </span>
      ))}
    </div>
  );
}
