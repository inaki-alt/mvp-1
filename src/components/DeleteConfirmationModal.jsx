import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1050,
      }}
    >
      <div
        className="modal-content card p-4"
        style={{
          width: '400px',
          borderRadius: '10px',
          background: '#fff'
        }}
      >
        <div className="modal-header d-flex justify-content-between align-items-center">
          <h5 className="modal-title">Confirm Delete</h5>
          <button onClick={onCancel} className="btn btn-sm btn-outline-secondary">
            <FaTimes />
          </button>
        </div>
        <div className="modal-body my-3">
          <p>Are you sure you want to delete this event?</p>
        </div>
        <div className="modal-footer d-flex justify-content-end gap-2">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeleteConfirmationModal; 