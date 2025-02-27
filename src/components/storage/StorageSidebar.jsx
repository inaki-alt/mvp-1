import React, { useState, useRef } from 'react'
import { FiBell, FiClock, FiFolder, FiHome, FiImage, FiInfo, FiPlus, FiSettings, FiShare2, FiStar, FiUpload, FiVideo, FiX } from 'react-icons/fi'
import Checkbox from '@/components/shared/Checkbox'
import PerfectScrollbar from "react-perfect-scrollbar";
import { supabase } from '@/supabaseClient';
import { toast } from 'react-toastify';

const filterMembers = ["Alls", "Users", "Editor", "Admin", "Contributor", "Administrator"]

const StorageSidebar = ({sidebarOpen, setSidebarOpen}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentCategory, setDocumentCategory] = useState('general');
  const [documentStatus, setDocumentStatus] = useState('active');
  const [isPublic, setIsPublic] = useState(false);
  const [documentTags, setDocumentTags] = useState('');
  const [documentVersion, setDocumentVersion] = useState(1);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    if (!documentTitle.trim()) {
      toast.error("Please enter a document title");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      // Generate a unique file name to avoid collisions
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      // Use the private folder path to match your RLS policy
      const filePath = `private/${user.id}/${fileName}`;
      const bucketName = 'documents';
      
      // Upload file to Supabase Storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          }
        });
      
      if (uploadError) throw uploadError;
      
      // Get a signed URL for the file
      const { data: urlData, error: urlError } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry for database storage
      
      if (urlError) throw urlError;
      
      // Parse tags from comma-separated string to array
      const tagsArray = documentTags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // Create document record in the database
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert([
          {
            title: documentTitle,
            description: documentDescription,
            category: documentCategory,
            status: documentStatus,
            file_url: urlData.signedUrl,
            file_name: selectedFile.name,
            file_type: selectedFile.type,
            file_size: selectedFile.size,
            uploaded_by_id: user.id,
            is_public: isPublic,
            tags: tagsArray.length > 0 ? tagsArray : null,
            version: documentVersion,
            metadata: { 
              bucket_name: bucketName,
              storage_path: filePath,
              original_name: selectedFile.name
            }
          }
        ])
        .select();
      
      if (documentError) throw documentError;
      
      toast.success("Document uploaded successfully");
      
      // Reset form
      setDocumentTitle('');
      setDocumentDescription('');
      setDocumentCategory('general');
      setDocumentStatus('active');
      setIsPublic(false);
      setDocumentTags('');
      setDocumentVersion(1);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowUploadModal(false);
      
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error(`Failed to upload document: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Styles for the modal
  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: showUploadModal ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1050,
  };
  
  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    maxHeight: '90vh',
    overflow: 'auto',
  };
  
  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '10px 12px',
    marginBottom: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  };
  
  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
  };
  
  const buttonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const checkboxStyle = {
    marginRight: '8px',
  };

  return (
    <>
      <div className={`content-sidebar content-sidebar-md ${sidebarOpen ? "app-sidebar-open" : ""}`}>
        <PerfectScrollbar>
          <div className="content-sidebar-header bg-white sticky-top hstack justify-content-between">
            <h4 className="fw-bolder mb-0">Documents</h4>
            <a href="#" className="app-sidebar-close-trigger d-flex" onClick={() => setSidebarOpen(false)}>
              <i><FiX /></i>
            </a>
          </div>
          <div className="content-sidebar-header">
            <a href="#" className="btn btn-primary w-100" onClick={() => setShowUploadModal(true)}>
              <FiUpload size={16} className="me-2" />
              <span>Upload Files</span>
            </a>
          </div>
          <div className="content-sidebar-body">
            <ul className="nav flex-column nxl-content-sidebar-item">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <FiHome size={16} strokeWidth={1.6} />
                  <span>Home</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <FiImage size={16} strokeWidth={1.6} />
                  <span>Images</span>
                </a>
              </li>
            </ul>
            <ul className="nav flex-column nxl-content-sidebar-item">
              <li className="px-4 mx-2 my-2 fs-10 fw-bold text-uppercase text-muted text-spacing-1 d-flex align-items-center justify-content-between">
                <span>Filter</span>
                <a href="#">
                  <span className="avatar-text avatar-sm" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Add New"> <FiPlus /> </span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <FiClock size={16} strokeWidth={1.6} />
                  <span>Recent</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <FiStar size={16} strokeWidth={1.6} />
                  <span>Favorite</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link d-flex align-items-center justify-content-between" href="#">
                  <span className="d-flex align-items-center">
                    <FiInfo size={16} strokeWidth={1.6} className='me-3' />
                    <span>Important</span>
                  </span>
                  <span className="badge bg-soft-success text-success">3</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <FiShare2 size={16} strokeWidth={1.6} />
                  <span>Shared Files</span>
                </a>
              </li>
            </ul>
          </div>
        </PerfectScrollbar>
      </div>
      
      {/* Upload Modal */}
      <div style={modalStyle}>
        <div style={modalContentStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Upload Document</h3>
            <button 
              onClick={() => setShowUploadModal(false)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleUpload}>
            <div>
              <label htmlFor="documentTitle" style={labelStyle}>Document Title*</label>
              <input
                type="text"
                id="documentTitle"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                style={inputStyle}
                placeholder="Enter document title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="documentDescription" style={labelStyle}>Description</label>
              <textarea
                id="documentDescription"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                style={{ ...inputStyle, minHeight: '100px' }}
                placeholder="Enter document description"
              />
            </div>
            
            <div>
              <label htmlFor="documentCategory" style={labelStyle}>Category*</label>
              <select
                id="documentCategory"
                value={documentCategory}
                onChange={(e) => setDocumentCategory(e.target.value)}
                style={inputStyle}
                required
              >
                <option value="general">General</option>
                <option value="financial">Financial</option>
                <option value="legal">Legal</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
                <option value="hr">Human Resources</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="documentStatus" style={labelStyle}>Status*</label>
              <select
                id="documentStatus"
                value={documentStatus}
                onChange={(e) => setDocumentStatus(e.target.value)}
                style={inputStyle}
                required
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div style={checkboxContainerStyle}>
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                style={checkboxStyle}
              />
              <label htmlFor="isPublic">Make document public</label>
            </div>
            
            <div>
              <label htmlFor="documentTags" style={labelStyle}>Tags (comma-separated)</label>
              <input
                type="text"
                id="documentTags"
                value={documentTags}
                onChange={(e) => setDocumentTags(e.target.value)}
                style={inputStyle}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            
            <div>
              <label htmlFor="documentVersion" style={labelStyle}>Version</label>
              <input
                type="number"
                id="documentVersion"
                value={documentVersion}
                onChange={(e) => setDocumentVersion(parseInt(e.target.value) || 1)}
                style={inputStyle}
                min="1"
              />
            </div>
            
            <div>
              <label htmlFor="documentFile" style={labelStyle}>File*</label>
              <input
                type="file"
                id="documentFile"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={inputStyle}
                required
              />
              {selectedFile && (
                <div style={{ fontSize: '14px', marginBottom: '16px' }}>
                  Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>
            
            {isUploading && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ height: '6px', backgroundColor: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${uploadProgress}%`, 
                      backgroundColor: '#4CAF50',
                      transition: 'width 0.3s ease'
                    }} 
                  />
                </div>
                <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px' }}>
                  {uploadProgress}% Uploaded
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button 
                type="button" 
                onClick={() => setShowUploadModal(false)}
                style={{
                  ...buttonStyle,
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid #ddd',
                }}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{
                  ...buttonStyle,
                  backgroundColor: '#4361ee',
                  color: 'white',
                  opacity: isUploading ? 0.7 : 1,
                }}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default StorageSidebar