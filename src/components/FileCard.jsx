import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  File,
  MoreVertical,
} from 'lucide-react';

const getFileIcon = (mimeType) => {
  if (!mimeType) return File;
  if (mimeType.startsWith('image/')) return FileImage;
  if (mimeType.startsWith('video/')) return FileVideo;
  if (mimeType.startsWith('audio/')) return FileAudio;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar') || mimeType.includes('archive'))
    return FileArchive;
  if (
    mimeType.includes('javascript') ||
    mimeType.includes('json') ||
    mimeType.includes('html') ||
    mimeType.includes('css') ||
    mimeType.includes('xml')
  )
    return FileCode;
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('text') ||
    mimeType.includes('word')
  )
    return FileText;
  return File;
};

const getFileExtension = (name) => {
  if (!name) return '';
  const parts = name.split('.');
  return parts.length > 1 ? parts.pop().toUpperCase() : '';
};

const formatSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export default function FileCard({ file, viewMode, onContextMenu }) {
  const IconComponent = getFileIcon(file.mimeType);
  const ext = getFileExtension(file.originalName);

  if (viewMode === 'list') {
    return (
      <div
        className="file-list-row"
        onContextMenu={(e) => onContextMenu(e, file, 'file')}
      >
        <div className="file-list-icon">
          <IconComponent size={18} />
        </div>
        <span className="file-list-name">{file.originalName}</span>
        <span className="file-list-date">
          {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : '—'}
        </span>
        <span className="file-list-size">{formatSize(file.size)}</span>
        <button
          className="btn-icon"
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, file, 'file');
          }}
        >
          <MoreVertical size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="file-card"
      onContextMenu={(e) => onContextMenu(e, file, 'file')}
    >
      <button
        className="file-card-more"
        onClick={(e) => {
          e.stopPropagation();
          onContextMenu(e, file, 'file');
        }}
      >
        <MoreVertical size={14} />
      </button>
      <div className="file-card-icon">
        <IconComponent size={40} />
        {ext && <span className="file-card-type">{ext}</span>}
      </div>
      <div className="file-card-name">{file.originalName}</div>
      <div className="file-card-meta">
        <span>{formatSize(file.size)}</span>
        <span>•</span>
        <span>{file.createdAt ? new Date(file.createdAt).toLocaleDateString() : ''}</span>
      </div>
    </div>
  );
}
