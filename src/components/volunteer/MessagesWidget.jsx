import React from 'react';
import { Link } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi';
import CardHeader from '@/components/shared/CardHeader';
import Pagination from '@/components/shared/Pagination';
import { volunteerDummyData } from '@/utils/fackData/volunteerData';

const MessagesWidget = ({ title = "Messages" }) => {
    // Map volunteer dummy messages to a format similar to PendingMessages.jsx
    const messages = volunteerDummyData.messages.map((msg, index) => ({
        id: index,
        sender: msg.org, // In this case, reusing the "org" as sender name
        message: msg.message,
        date: msg.date,
        status: "Received" // Or any status you want to display
    }));

    return (
        <div className="card mb-4">
            <CardHeader title={title} />
            <div className="card-body custom-card-action p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr className="border-b">
                                <th scope="row">Sender</th>
                                <th>Message</th>
                                <th>Received Date</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(({ id, sender, message, date, status }) => (
                                <tr key={id} className="chat-single-item">
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="text-white avatar-text user-avatar-text">
                                                {sender.substring(0, 1)}
                                            </div>
                                            <Link to="#">
                                                <span className="d-block">{sender}</span>
                                            </Link>
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            className="d-block text-muted text-truncate"
                                            title={message}
                                        >
                                            {message.length > 50 ? message.substring(0, 50) + "..." : message}
                                        </span>
                                    </td>
                                    <td>{date}</td>
                                    <td>
                                        <span className="badge bg-soft-success text-success">{status}</span>
                                    </td>
                                    <td className="text-end">
                                        <Link to="#">
                                            <FiMoreVertical size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card-footer">
                <Pagination />
            </div>
        </div>
    );
};

export default MessagesWidget; 