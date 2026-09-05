export const getFileExtension = (name) => {
  if (!name) return 'FILE';
  const parts = name.split('.');
  return parts.length > 1 ? parts.pop().toUpperCase() : 'FILE';
};

export const getFileCategory = (file) => {
  const target = file?.file || file;
  const name = (target?.originalName || target?.name || file?.originalName || file?.name || '').toLowerCase();
  const mime = (target?.mimeType || file?.mimeType || '').toLowerCase();
  const ext = name.includes('.') ? name.split('.').pop() : '';

  // 1. Image
  if (
    mime.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'avif', 'heic', 'raw'].includes(ext)
  ) {
    return 'image';
  }

  // 2. Video
  if (
    mime.startsWith('video/') ||
    ['mp4', 'mkv', 'mov', 'avi', 'webm', 'flv', 'wmv', 'm4v', '3gp', 'ts', 'ogv'].includes(ext)
  ) {
    return 'video';
  }

  // 3. Audio
  if (
    mime.startsWith('audio/') ||
    ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a', 'wma', 'opus', 'aiff'].includes(ext)
  ) {
    return 'audio';
  }

  // 4. Document
  if (
    mime.startsWith('text/') ||
    mime.includes('pdf') ||
    mime.includes('word') ||
    mime.includes('officedocument') ||
    mime.includes('excel') ||
    mime.includes('powerpoint') ||
    mime.includes('opendocument') ||
    mime.includes('rtf') ||
    mime.includes('csv') ||
    [
      'pdf', 'doc', 'docx', 'txt', 'rtf', 'odt',
      'xls', 'xlsx', 'csv', 'tsv',
      'ppt', 'pptx', 'odp', 'ods',
      'md', 'pages', 'numbers', 'key', 'epub'
    ].includes(ext)
  ) {
    return 'doc';
  }

  // 5. Code / Dev
  if (
    ['json', 'xml', 'html', 'css', 'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'go', 'rs', 'php', 'sql', 'sh', 'yaml', 'yml'].includes(ext)
  ) {
    return 'code';
  }

  // 6. Archive / Zip
  if (
    ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)
  ) {
    return 'archive';
  }

  return 'other';
};

export const formatSize = (bytes) => {
  if (typeof bytes !== 'number' && typeof bytes !== 'bigint') return '—';
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};
