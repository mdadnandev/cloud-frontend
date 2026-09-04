import { useEffect, useRef } from 'react';

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

  const renameSvg = (
    <svg viewBox="0 0 20 20">
      <path d="M4 13.5V16h2.5l7.4-7.4-2.5-2.5z" />
      <path d="M12.5 4.5l3 3" />
    </svg>
  );

  const shareSvg = (
    <svg viewBox="0 0 20 20">
      <path d="M8 12l4-4M7.5 13.5l-1.7 1.7a2.6 2.6 0 01-3.7-3.7L5.8 7.8a2.6 2.6 0 013.7 0M12.5 6.5l1.7-1.7a2.6 2.6 0 013.7 3.7L14.2 12.2a2.6 2.6 0 01-3.7 0" />
    </svg>
  );

  const moveSvg = (
    <svg viewBox="0 0 20 20">
      <path d="M2.5 5.5A1.5 1.5 0 014 4h3.6l1.4 1.8h7.1A1.5 1.5 0 0117.5 7.3v7.2A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5z" />
    </svg>
  );

  const trashSvg = (
    <svg viewBox="0 0 20 20">
      <path d="M4 5.5h12M8 5.5V4a1 1 0 011-1h2a1 1 0 011 1v1.5M6 5.5l.7 10a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-10" />
    </svg>
  );

  const fileActions = [
    { id: 'rename', label: 'Rename', svg: renameSvg },
    { id: 'share', label: 'Share', svg: shareSvg },
    { id: 'move', label: 'Move to', svg: moveSvg },
    { divider: true },
    { id: 'trash', label: 'Delete', svg: trashSvg, danger: true },
  ];

  const folderActions = [
    { id: 'rename', label: 'Rename', svg: renameSvg },
    { divider: true },
    { id: 'trash', label: 'Delete', svg: trashSvg, danger: true },
  ];

  const actions = itemType === 'folder' ? folderActions : fileActions;

  return (
    <div
      ref={menuRef}
      className="menu open"
      style={{ left: x, top: y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {actions.map((action, i) =>
        action.divider ? (
          <div key={`div-${i}`} className="menu-divider" />
        ) : (
          <button
            key={action.id}
            className={`menu-item ${action.danger ? 'danger' : ''}`}
            onClick={() => {
              onAction(action.id, item, itemType);
              onClose();
            }}
          >
            <span className="icon" style={{ width: 15, height: 15 }}>
              {action.svg}
            </span>
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

