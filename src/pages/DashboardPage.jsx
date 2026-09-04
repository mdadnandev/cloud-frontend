import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import FileBrowser from '../components/FileBrowser';
import ContextMenu from '../components/ContextMenu';
import CreateFolderModal from '../components/CreateFolderModal';
import UploadZone from '../components/UploadZone';
import RenameModal from '../components/RenameModal';
import MoveModal from '../components/MoveModal';
import ShareModal from '../components/ShareModal';
import PublicLinkModal from '../components/PublicLinkModal';
import { fileAPI, folderAPI, shareAPI, trashAPI, searchAPI } from '../api/axios';
import '../styles/dashboard.css';

export default function DashboardPage() {
  // Navigation & View state
  const [activeView, setActiveView] = useState('my-drive'); // 'my-drive' | 'shared' | 'trash'
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folderPath, setFolderPath] = useState([]); // [{ id, name }]
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Content state
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Context Menu state
  const [contextMenu, setContextMenu] = useState(null); // { x, y, item, itemType }

  // Modal states
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [moveTarget, setMoveTarget] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);
  const [publicLinkTarget, setPublicLinkTarget] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (type, text) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Load content based on view & folder
  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const searchRes = await searchAPI.search(searchQuery.trim());
        const results = searchRes.data?.content || searchRes.data || [];
        setFiles(results.filter((i) => !i.isFolder));
        setFolders(results.filter((i) => i.isFolder));
        setLoading(false);
        return;
      }

      if (activeView === 'my-drive') {
        const [foldersRes, filesRes] = await Promise.allSettled([
          folderAPI.listFolders(currentFolderId),
          fileAPI.listFiles(currentFolderId),
        ]);

        const fetchedFolders =
          foldersRes.status === 'fulfilled' ? foldersRes.value.data || [] : [];
        const fetchedFiles =
          filesRes.status === 'fulfilled' ? filesRes.value.data || [] : [];

        setFolders(Array.isArray(fetchedFolders) ? fetchedFolders : []);
        setFiles(Array.isArray(fetchedFiles) ? fetchedFiles : []);
      } else if (activeView === 'shared') {
        setFolders([]);
        const sharedRes = await shareAPI.getSharedWithMe();
        setFiles(Array.isArray(sharedRes.data) ? sharedRes.data : []);
      } else if (activeView === 'trash') {
        setFolders([]);
        const trashRes = await trashAPI.listTrashed();
        setFiles(Array.isArray(trashRes.data) ? trashRes.data : []);
      }
    } catch (err) {
      console.error('Error loading content:', err);
      addToast('error', 'Failed to load drive items');
    } finally {
      setLoading(false);
    }
  }, [activeView, currentFolderId, searchQuery]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // View switch reset
  const handleViewChange = (view) => {
    setActiveView(view);
    setCurrentFolderId(null);
    setFolderPath([]);
    setSearchQuery('');
  };

  // Folder navigation
  const handleFolderClick = (folder) => {
    setCurrentFolderId(folder.id);
    setFolderPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbNavigate = (targetFolderId) => {
    if (targetFolderId === null) {
      setCurrentFolderId(null);
      setFolderPath([]);
    } else {
      const idx = folderPath.findIndex((f) => f.id === targetFolderId);
      if (idx !== -1) {
        setCurrentFolderId(targetFolderId);
        setFolderPath(folderPath.slice(0, idx + 1));
      }
    }
  };

  // Context Menu Trigger
  const handleContextMenu = (e, item, itemType) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      itemType,
    });
  };

  // Context Menu Action Dispatcher
  const handleContextMenuAction = async (actionId, item, itemType) => {
    setContextMenu(null);
    if (actionId === 'rename') {
      setRenameTarget(item);
    } else if (actionId === 'move') {
      setMoveTarget(item);
    } else if (actionId === 'share') {
      setShareTarget(item);
    } else if (actionId === 'public-link') {
      setPublicLinkTarget(item);
    } else if (actionId === 'trash') {
      try {
        if (itemType === 'file') {
          await trashAPI.trashFile(item.id);
          addToast('success', `Moved "${item.originalName || item.name}" to trash`);
        }
        loadContent();
      } catch (err) {
        addToast('error', err.response?.data?.message || 'Failed to move to trash');
      }
    }
  };

  const getViewTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    if (activeView === 'shared') return 'Shared with Me';
    if (activeView === 'trash') return 'Trash';
    if (folderPath.length > 0) return folderPath[folderPath.length - 1].name;
    return 'My Drive';
  };

  const folderPlusIcon = (
    <svg viewBox="0 0 20 20">
      <path d="M2.5 5.5A1.5 1.5 0 014 4h3.6l1.4 1.8h7.1A1.5 1.5 0 0117.5 7.3v7.2A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5z" />
      <path d="M10 8.5v4M8 10.5h4" />
    </svg>
  );

  const uploadIcon = (
    <svg viewBox="0 0 20 20">
      <path d="M10 13V4M6.5 7.5L10 4l3.5 3.5M4 15.5h12" />
    </svg>
  );

  const refreshIcon = (
    <svg viewBox="0 0 20 20">
      <path d="M16 5.5v3.5h-3.5M4 14.5V11h3.5" />
      <path d="M15.3 8.5A5.5 5.5 0 105.2 12M4.7 11.5A5.5 5.5 0 0114.8 8" />
    </svg>
  );

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        onUploadClick={() => setUploadModalOpen(true)}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <main className="app-main">
        <Header
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSearch={(q) => setSearchQuery(q)}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <div className="app-content">
          {/* Breadcrumbs for Drive Hierarchy */}
          {activeView === 'my-drive' && !searchQuery && (
            <Breadcrumb path={folderPath} onNavigate={handleBreadcrumbNavigate} />
          )}

          {/* Section Header & Top Actions */}
          <div className="content-head">
            <div>
              <h1>{getViewTitle()}</h1>
              <div className="sub">
                {folders.length + files.length} item{folders.length + files.length === 1 ? '' : 's'} · updated today
              </div>
            </div>

            <div className="content-actions">
              {activeView === 'my-drive' && (
                <>
                  <button
                    id="new-folder-btn"
                    className="btn btn-ghost"
                    onClick={() => setCreateFolderOpen(true)}
                  >
                    <span className="icon">{folderPlusIcon}</span>
                    <span>New folder</span>
                  </button>
                  <button
                    id="upload-btn"
                    className="btn btn-primary"
                    onClick={() => setUploadModalOpen(true)}
                  >
                    <span className="icon">{uploadIcon}</span>
                    <span>Upload</span>
                  </button>
                </>
              )}
              <button
                className="btn btn-ghost btn-icon"
                onClick={loadContent}
                title="Refresh"
                aria-label="Refresh"
              >
                <span className="icon">{refreshIcon}</span>
              </button>
            </div>
          </div>

          {/* Core File & Folder Browser Grid */}
          <FileBrowser
            folders={folders}
            files={files}
            viewMode={viewMode}
            loading={loading}
            onFolderClick={handleFolderClick}
            onContextMenu={handleContextMenu}
            activeView={activeView}
            searchQuery={searchQuery}
            onUploadClick={() => setUploadModalOpen(true)}
            onCreateFolderClick={() => setCreateFolderOpen(true)}
          />
        </div>
      </main>

      {/* Overlays & Modals */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          itemType={contextMenu.itemType}
          onClose={() => setContextMenu(null)}
          onAction={handleContextMenuAction}
        />
      )}

      {createFolderOpen && (
        <CreateFolderModal
          parentId={currentFolderId}
          onClose={() => setCreateFolderOpen(false)}
          onCreated={() => {
            addToast('success', 'Folder created successfully');
            loadContent();
          }}
        />
      )}

      {uploadModalOpen && (
        <UploadZone
          currentFolderId={currentFolderId}
          onClose={() => setUploadModalOpen(false)}
          onUploadComplete={() => {
            addToast('success', 'File uploaded');
            loadContent();
          }}
        />
      )}

      {renameTarget && (
        <RenameModal
          item={renameTarget}
          onClose={() => setRenameTarget(null)}
          onRenamed={() => {
            addToast('success', 'Item renamed');
            loadContent();
          }}
        />
      )}

      {moveTarget && (
        <MoveModal
          item={moveTarget}
          availableFolders={folders}
          onClose={() => setMoveTarget(null)}
          onMoved={() => {
            addToast('success', 'Item moved successfully');
            loadContent();
          }}
        />
      )}

      {shareTarget && (
        <ShareModal
          file={shareTarget}
          onClose={() => setShareTarget(null)}
        />
      )}

      {publicLinkTarget && (
        <PublicLinkModal
          file={publicLinkTarget}
          onClose={() => setPublicLinkTarget(null)}
        />
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}