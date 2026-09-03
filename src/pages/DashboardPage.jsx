import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import FileBrowser from '../components/FileBrowser';
import UploadZone from '../components/UploadZone';
import CreateFolderModal from '../components/CreateFolderModal';
import RenameModal from '../components/RenameModal';
import MoveModal from '../components/MoveModal';
import ShareModal from '../components/ShareModal';
import PublicLinkModal from '../components/PublicLinkModal';
import ContextMenu from '../components/ContextMenu';
import { fileAPI, folderAPI, shareAPI, trashAPI, searchAPI } from '../api/axios';
import { FolderPlus, UploadCloud, RefreshCw } from 'lucide-react';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('my-drive');
  const [viewMode, setViewMode] = useState('grid');
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [renameItem, setRenameItem] = useState(null);
  const [moveItem, setMoveItem] = useState(null);
  const [shareItem, setShareItem] = useState(null);
  const [publicLinkItem, setPublicLinkItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const res = await searchAPI.search(searchQuery.trim());
        const searchData = res.data;
        setFolders(searchData.folders?.content || searchData.folders || []);
        setFiles(searchData.files?.content || searchData.files || []);
        setLoading(false);
        return;
      }

      if (activeView === 'my-drive') {
        const folderId = currentFolder ? currentFolder.id : null;
        try {
          const [filesRes, foldersRes] = await Promise.allSettled([
            fileAPI.listFiles(folderId),
            folderAPI.listFolders(folderId),
          ]);
          setFiles(filesRes.status === 'fulfilled' ? filesRes.value.data || [] : []);
          setFolders(foldersRes.status === 'fulfilled' ? foldersRes.value.data || [] : []);
        } catch {
          setFiles([]);
          setFolders([]);
        }
      } else if (activeView === 'shared') {
        try {
          const res = await shareAPI.getSharedWithMe();
          const shares = res.data || [];
          setFiles(shares.map((s) => ({ ...s.file, sharedPermission: s.permission })).filter(Boolean));
          setFolders([]);
        } catch {
          setFiles([]);
          setFolders([]);
        }
      } else if (activeView === 'trash') {
        try {
          const res = await trashAPI.listTrashed();
          setFiles(res.data || []);
          setFolders([]);
        } catch {
          setFiles([]);
          setFolders([]);
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeView, currentFolder, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Navigate into a folder
  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setBreadcrumbPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  // Navigate via breadcrumb
  const handleBreadcrumbNavigate = (folderId) => {
    if (folderId === null) {
      setCurrentFolder(null);
      setBreadcrumbPath([]);
    } else {
      const idx = breadcrumbPath.findIndex((f) => f.id === folderId);
      if (idx !== -1) {
        setBreadcrumbPath(breadcrumbPath.slice(0, idx + 1));
        setCurrentFolder(breadcrumbPath[idx]);
      }
    }
  };

  // Right click / more menu
  const handleContextMenu = (e, item, itemType) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      itemType,
    });
  };

  const handleContextMenuAction = async (actionId, item, itemType) => {
    if (actionId === 'rename') {
      setRenameItem({ ...item, itemType });
    } else if (actionId === 'move') {
      setMoveItem(item);
    } else if (actionId === 'share') {
      setShareItem(item);
    } else if (actionId === 'public-link') {
      setPublicLinkItem(item);
    } else if (actionId === 'trash') {
      try {
        await trashAPI.trashFile(item.id);
        showToast(`Moved "${item.originalName || item.name}" to trash`, 'info');
        loadData();
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to trash item', 'error');
      }
    }
  };

  const getPageTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    if (activeView === 'shared') return 'Shared with Me';
    if (activeView === 'trash') return 'Trash';
    return currentFolder ? currentFolder.name : 'My Drive';
  };

  return (
    <div className="dashboard">
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setCurrentFolder(null);
          setBreadcrumbPath([]);
          setSearchQuery('');
        }}
        onUploadClick={() => setIsUploadOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="dashboard-main">
        <Header
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSearch={(q) => setSearchQuery(q)}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="dashboard-content">
          {/* Header section with title and quick actions */}
          <div className="content-header">
            <div>
              <h1 className="content-title">{getPageTitle()}</h1>
              {activeView === 'my-drive' && !searchQuery && (
                <div style={{ marginTop: 8 }}>
                  <Breadcrumb path={breadcrumbPath} onNavigate={handleBreadcrumbNavigate} />
                </div>
              )}
            </div>

            {activeView === 'my-drive' && !searchQuery && (
              <div className="content-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsCreateFolderOpen(true)}
                  title="Create new folder"
                >
                  <FolderPlus size={16} />
                  <span>New Folder</span>
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsUploadOpen(true)}
                  title="Upload files"
                >
                  <UploadCloud size={16} />
                  <span>Upload</span>
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={loadData}
                  title="Refresh view"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Main file browser area */}
          <FileBrowser
            folders={folders}
            files={files}
            viewMode={viewMode}
            loading={loading}
            onFolderClick={handleFolderClick}
            onContextMenu={handleContextMenu}
            activeView={activeView}
            searchQuery={searchQuery}
            onUploadClick={() => setIsUploadOpen(true)}
            onCreateFolderClick={() => setIsCreateFolderOpen(true)}
          />
        </main>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <UploadZone
          currentFolderId={currentFolder?.id}
          onUploadComplete={() => {
            showToast('Files uploaded successfully!');
            loadData();
          }}
          onClose={() => setIsUploadOpen(false)}
        />
      )}

      {/* Create Folder Modal */}
      {isCreateFolderOpen && (
        <CreateFolderModal
          parentId={currentFolder?.id}
          onClose={() => setIsCreateFolderOpen(false)}
          onCreated={() => {
            showToast('Folder created!');
            loadData();
          }}
        />
      )}

      {/* Rename Modal */}
      {renameItem && (
        <RenameModal
          item={renameItem}
          onClose={() => setRenameItem(null)}
          onRenamed={() => {
            showToast('Renamed successfully!');
            loadData();
          }}
        />
      )}

      {/* Move Modal */}
      {moveItem && (
        <MoveModal
          item={moveItem}
          availableFolders={folders}
          onClose={() => setMoveItem(null)}
          onMoved={() => {
            showToast('File moved!');
            loadData();
          }}
        />
      )}

      {/* Share Modal */}
      {shareItem && (
        <ShareModal
          file={shareItem}
          onClose={() => setShareItem(null)}
        />
      )}

      {/* Public Link Modal */}
      {publicLinkItem && (
        <PublicLinkModal
          file={publicLinkItem}
          onClose={() => setPublicLinkItem(null)}
        />
      )}

      {/* Context Menu */}
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

      {/* Global Notification Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
