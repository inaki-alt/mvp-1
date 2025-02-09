import React from 'react';
import { FiX, FiDownload, FiShare2 } from 'react-icons/fi';
import './QRModal.css';

const QRModal = ({ event, onClose }) => {
    // Generate dummy QR code URL - in real app, this would be dynamic
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(event.title)}`;

    return (
        <div className="qr-modal-overlay" onClick={onClose}>
            <div className="qr-modal" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <FiX size={24} />
                </button>
                
                <div className="qr-content">
                    <div className="qr-header">
                        <h2>Event Check-In QR Code</h2>
                        <p className="event-title">{event.title}</p>
                    </div>

                    <div className="qr-container">
                        <div className="qr-frame">
                            <img src={qrCodeUrl} alt="QR Code" className="qr-code" />
                            <div className="qr-shine"></div>
                        </div>
                    </div>

                    <div className="qr-info">
                        <p className="qr-instruction">Scan this QR code at the event location to check in</p>
                        <div className="event-details">
                            <p>{event.date} at {event.time}</p>
                            <p>{event.location}</p>
                        </div>
                    </div>

                    <div className="qr-actions">
                        <button className="qr-action-button">
                            <FiDownload size={18} />
                            <span>Download</span>
                        </button>
                        <button className="qr-action-button">
                            <FiShare2 size={18} />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRModal; 