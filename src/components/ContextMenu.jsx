import { useEffect, useRef } from 'react';
import { Pencil, FolderInput, Share2, Link, Trash2 } from 'lucide-react';

export default function ContextMenu({ x, y, item, itemType, onClose, onAction }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('contextmenu', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('contextmenu', handler);
    };
  }, [onClose]);

  // Adjust position to stay within viewport
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        menuRef.current.style.left = `${x - rect.width}px`;
      }
      if (rect.bottom > window.innerHeight) {
        menuRef.current.style.top = `${y - rect.height}px`;
      }
    }
  }, [x, y]);

  const fileActions = [
    { id: 'rename', label: 'Rename', icon: Pencil },
    { id: 'move', label: 'Move to...', icon: FolderInput },
    { id: 'share', label: 'Share', icon: Share2 },
    { id: 'public-link', label: 'Get Link', icon: Link },
    { divider: true },
    { id: 'trash', label: 'Move to Trash', icon: Trash2, danger: true },
  ];

  const folderActions = [
    { id: 'rename', label: 'Rename', icon: Pencil },
    { divider: true },
    { id: 'trash', label: 'Move to Trash', icon: Trash2, danger: true },
  ];

  const actions = itemType === 'folder' ? folderActions : fileActions;

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: x, top: y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {actions.map((action, i) =>
        action.divider ? (
          <div key={`div-${i}`} className="context-menu-divider" />
        ) : (
          <button
            key={action.id}
            className={`context-menu-item ${action.danger ? 'danger' : ''}`}
            onClick={() => {
              onAction(action.id, item, itemType);
              onClose();
            }}
          >
            <action.icon size={16} />
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
