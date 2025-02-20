import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CSVImportModal = ({ onClose, onConfirm }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // A simple CSV parser that assumes the first line contains headers and rows are comma-separated.
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const result = lines.slice(1).map((line) => {
      const values = line.split(',');
      const entry = {};
      headers.forEach((header, index) => {
        entry[header.trim()] = values[index] ? values[index].trim() : '';
      });
      return entry;
    });
    return result;
  };

  const handleConfirm = () => {
    if (!file) {
      toast.error("Please select a CSV file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parsedData = parseCSV(text);
      onConfirm(parsedData);
      toast.success("Everything was inserted correctly");
      onClose();
    };
    reader.readAsText(file);
  };

  // Updated style objects

  // Overlay uses a soft, light gray background.
  const overlayStyle = {
    position: 'fixed',
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    background: 'rgba(240,240,240,0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  // The modal is a centered, not full-screen dialog.
  const modalStyle = {
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '450px',
    width: '90%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    border: '2px solid #000',
    animation: 'fadeIn 0.3s ease',
  };

  const headerStyle = {
    fontSize: '24px',
    marginBottom: '10px',
    textAlign: 'center',
    fontWeight: '600',
    color: '#000'
  };

  const instructionStyle = {
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
    marginBottom: '20px',
  };

  const fileLabelStyle = {
    display: 'block',
    cursor: 'pointer',
    border: '2px dashed #000',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    color: '#000',
    fontSize: '16px',
    transition: 'background 0.3s, color 0.3s',
    marginBottom: '20px'
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  };

  // White cancel button with black border and text.
  const cancelButtonStyle = {
    background: '#fff',
    border: '2px solid #000',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#000',
    flex: 1,
    marginRight: '10px',
    transition: 'background 0.3s, color 0.3s',
  };

  // Black confirm button with white text.
  const confirmButtonStyle = {
    background: '#000',
    border: '2px solid #000',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#fff',
    flex: 1,
    transition: 'background 0.3s, color 0.3s',
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      style={overlayStyle}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={modalStyle}
      >
        <h2 style={headerStyle}>Import CSV</h2>
        <p style={instructionStyle}>
          Please ensure your CSV file includes the following columns: <br />
          <strong>volunteer_name, email, phone, date</strong>
        </p>
        <div>
          <label htmlFor="fileInput" style={fileLabelStyle}>
            {file ? file.name : "Click to select CSV file"}
          </label>
          <input 
            id="fileInput" 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
        </div>
        <div style={buttonContainerStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
          <button onClick={handleConfirm} style={confirmButtonStyle}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default CSVImportModal; 