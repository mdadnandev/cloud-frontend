import { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import FileBrowser from '../components/FileBrowser';
import FileTypeFilter from '../components/FileTypeFilter';
import ContextMenu from '../components/ContextMenu';
import CreateFolderModal from '../components/CreateFolderModal';
import UploadZone from '../components/UploadZone';
import RenameModal from '../components/RenameModal';
import MoveModal from '../components/MoveModal';
import ShareModal from '../components/ShareModal';
import PublicLinkModal from '../components/PublicLinkModal';
import { fileAPI, folderAPI, shareAPI, trashAPI, searchAPI } from '../api/axios';
import { getFileCategory } from '../utils/fileUtils';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('my-drive');
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);

  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [moveTarget, setMoveTarget] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);
  const [publicLinkTarget, setPublicLinkTarget] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (type, text) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

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

        const fetchedFolders = foldersRes.status === 'fulfilled' ? foldersRes.value.data || [] : [];
        const fetchedFiles = filesRes.status === 'fulfilled' ? filesRes.value.data || [] : [];

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

  const handleViewChange = (view) => {
    setActiveView(view);
    setCurrentFolderId(null);
    setFolderPath([]);
    setSearchQuery('');
    setActiveFilter('all');
  };

  const handleFolderClick = (folder) => {
    setCurrentFolderId(folder.id);
    setFolderPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
    setActiveFilter('all');
  };

  const handleBreadcrumbNavigate = (targetFolderId) => {
    setActiveFilter('all');
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

  // Filter file counts
  const filterCounts = useMemo(() => {
    const counts = {
      all: files.length,
      doc: 0,
      image: 0,
      video: 0,
      audio: 0,
    };

    files.forEach((file) => {
      const cat = getFileCategory(file);
      if (cat === 'doc') counts.doc += 1;
      else if (cat === 'image') counts.image += 1;
      else if (cat === 'video') counts.video += 1;
      else if (cat === 'audio') counts.audio += 1;
    });

    return counts;
  }, [files]);

  // Filtered files based on activeFilter
  const filteredFiles = useMemo(() => {
    if (activeFilter === 'all') return files;
    return files.filter((file) => getFileCategory(file) === activeFilter);
  }, [files, activeFilter]);

  // ==========================================
  // Open / View / Download file
  const handleFileClick = async (file) => {
    try {
      addToast('info', `Opening "${file.originalName || file.name || 'file'}"...`);
      const res = await fileAPI.getDownloadUrl(file.id);
      const downloadUrl = res.data?.downloadUrl;

      if (downloadUrl) {
        const win = window.open(downloadUrl, '_blank', 'noopener,noreferrer');
        if (!win) {
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.download = file.originalName || file.name || 'download';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        addToast('error', 'Backend did not return a valid download link');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      const msg = error.response?.data?.message || 'Could not open this file';
      addToast('error', msg);
    }
  };

  const handleContextMenu = (e, item, itemType) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item, itemType });
  };

  const handleContextMenuAction = async (actionId, item, itemType) => {
    setContextMenu(null);
    if (actionId === 'open') {
      if (itemType === 'folder') {
        handleFolderClick(item);
      } else {
        handleFileClick(item);
      }
    } else if (actionId === 'rename') {
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

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        onUploadClick={() => setUploadModalOpen(true)}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className="app-main">
        <Header
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSearch={(q) => setSearchQuery(q)}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <div className="app-content">
          {activeView === 'my-drive' && !searchQuery && (
            <Breadcrumb path={folderPath} onNavigate={handleBreadcrumbNavigate} />
          )}

          <div className="content-head">
            <div>
              <h1>{getViewTitle()}</h1>
              <div className="sub">
                {activeFilter === 'all'
                  ? `${folders.length + files.length} items · updated today`
                  : `Showing ${filteredFiles.length} of ${files.length} files`}
              </div>
            </div>

            <div className="content-actions">
              {activeView === 'my-drive' && (
                <>
                  <button className="btn btn-ghost" onClick={() => setCreateFolderOpen(true)}>
                    New folder
                  </button>
                  <button className="btn btn-primary" onClick={() => setUploadModalOpen(true)}>
                    Upload
                  </button>
                </>
              )}
              <button className="btn btn-ghost btn-icon" onClick={loadContent} title="Refresh">
                Refresh
              </button>
            </div>
          </div>

          {/* File Type Filter Bar (Doc, Image, Video, Audio, All) */}
          <FileTypeFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={filterCounts}
          />

          <FileBrowser
            folders={folders}
            files={filteredFiles}
            viewMode={viewMode}
            loading={loading}
            onFolderClick={handleFolderClick}
            onFileClick={handleFileClick}
            onContextMenu={handleContextMenu}
            activeView={activeView}
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            onClearFilter={() => setActiveFilter('all')}
            onUploadClick={() => setUploadModalOpen(true)}
            onCreateFolderClick={() => setCreateFolderOpen(true)}
          />
        </div>
      </main>

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
          onCreated={() => { addToast('success', 'Folder created'); loadContent(); }}
        />
      )}

      {uploadModalOpen && (
        <UploadZone
          currentFolderId={currentFolderId}
          onClose={() => setUploadModalOpen(false)}
          onUploadComplete={() => { addToast('success', 'File uploaded'); loadContent(); }}
        />
      )}

      {renameTarget && (
        <RenameModal item={renameTarget} onClose={() => setRenameTarget(null)} onRenamed={() => { addToast('success', 'Renamed'); loadContent(); }} />
      )}

      {moveTarget && (
        <MoveModal item={moveTarget} availableFolders={folders} onClose={() => setMoveTarget(null)} onMoved={() => { addToast('success', 'Moved'); loadContent(); }} />
      )}

      {shareTarget && <ShareModal file={shareTarget} onClose={() => setShareTarget(null)} />}

      {publicLinkTarget && <PublicLinkModal file={publicLinkTarget} onClose={() => setPublicLinkTarget(null)} />}

      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}><span>{toast.text}</span></div>
        ))}
      </div>
    </div>
  );
}