import { useRef, useState } from 'react';
import { Upload, CloudUpload, X, CheckCircle } from 'lucide-react';
import { fileAPI, uploadToPresignedUrl } from '../api/axios';

export default function UploadZone({ currentFolderId, onUploadComplete, onClose }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploads, setUploads] = useState([]);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const uploadItem = {
        id: Date.now() + Math.random(),
        name: file.name,
        progress: 0,
        status: 'uploading', // uploading | done | error
      };

      setUploads((prev) => [...prev, uploadItem]);

      try {
        // Step 1: Get presigned URL
        const initRes = await fileAPI.initUpload(file.name, file.type);
        const { uploadUrl, storageKey } = initRes.data;

        // Step 2: Upload to presigned URL
        await uploadToPresignedUrl(uploadUrl, file, (percent) => {
          setUploads((prev) =>
            prev.map((u) => (u.id === uploadItem.id ? { ...u, progress: percent } : u))
          );
        });

        // Step 3: Complete upload (save metadata)
        await fileAPI.completeUpload(file.name, storageKey, file.size, file.type);

        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadItem.id ? { ...u, progress: 100, status: 'done' } : u
          )
        );

        if (onUploadComplete) onUploadComplete();
      } catch (err) {
        console.error('Upload failed:', err);
        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadItem.id ? { ...u, status: 'error' } : u
          )
        );
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div className="modal-header">
          <h3 className="modal-title">Upload Files</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div
          className={`upload-zone ${dragOver ? 'dragover' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-zone-icon">
            <CloudUpload size={24} />
          </div>
          <h3>Drop files here or click to browse</h3>
          <p>Upload any file type up to 100 MB</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {uploads.length > 0 && (
          <div className="upload-progress-list">
            {uploads.map((upload) => (
              <div key={upload.id} className="upload-progress-item">
                {upload.status === 'done' ? (
                  <CheckCircle size={18} color="var(--success)" />
                ) : (
                  <Upload size={18} color="var(--accent-primary)" />
                )}
                <div className="upload-progress-info">
                  <div className="upload-progress-name">{upload.name}</div>
                  {upload.status === 'uploading' && (
                    <div className="upload-progress-bar">
                      <div
                        className="upload-progress-fill"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <span className="upload-progress-percent">
                  {upload.status === 'done'
                    ? 'Done'
                    : upload.status === 'error'
                    ? 'Failed'
                    : `${upload.progress}%`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
