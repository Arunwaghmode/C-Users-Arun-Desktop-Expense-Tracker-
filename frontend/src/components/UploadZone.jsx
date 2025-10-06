import { useState, useRef } from 'react';
import './UploadZone.css';

function UploadZone({ onFileSelected }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleExtract = () => {
    if (selectedFile && preview) {
      onFileSelected(selectedFile, preview);
      // Reset
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (preview) {
    return (
      <div className="upload-zone preview-mode">
        <div className="preview-container">
          <img src={preview} alt="Receipt preview" className="receipt-preview" />
          <div className="preview-info">
            <div className="file-name">
              ✅ {selectedFile.name}
            </div>
            <div className="file-size">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </div>
            <div className="preview-actions">
              <button onClick={handleExtract} className="btn-extract">
                🔍 Extract Data
              </button>
              <button onClick={handleCancel} className="btn-cancel-preview">
                ✖ Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      
      <div className="upload-content">
        <div className="upload-icon">📸</div>
        <h2>Drag & Drop Receipt Here</h2>
        <p className="upload-subtext">or click to browse files</p>
        <button className="btn-choose-file" onClick={(e) => e.stopPropagation()}>
          📁 Choose File
        </button>
        <p className="upload-info">Supported: JPG, PNG, WebP • Max 5MB</p>
      </div>
    </div>
  );
}

export default UploadZone;




