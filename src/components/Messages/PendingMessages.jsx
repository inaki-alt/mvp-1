import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import CardHeader from "@/components/shared/CardHeader";
import Pagination from "@/components/shared/Pagination";
import CardLoader from "@/components/shared/CardLoader";
import { supabase } from "@/supabaseClient";

const PendingMessages = ({ title }) => {
    const [messages, setMessages] = useState([]);

    // Add dummy data
    const DUMMY_MESSAGES = [
        {
            id: 1,
            sender_id: "Sarah Johnson",
            phone: "(555) 123-4567",
            content: "Hi, I saw your post about the food drive this weekend. I'd love to help out! What time should I arrive and what should I bring?",
            created_at: "2024-03-21 09:15:23",
            conversation_id: 1
        },
        {
            id: 2,
            sender_id: "Michael Chen",
            phone: "(555) 123-4568",
            content: "I'm a local business owner interested in sponsoring your next community event. Could we schedule a call to discuss partnership opportunities?",
            created_at: "2024-03-21 08:45:12",
            conversation_id: 2
        },
        {
            id: 3,
            sender_id: "Emily Rodriguez",
            phone: "(555) 123-4569",
            content: "Quick question - for the youth mentorship program, is there a minimum time commitment required for volunteers? I work full-time but would love to participate.",
            created_at: "2024-03-20 16:30:45",
            conversation_id: 3
        },
        {
            id: 4,
            sender_id: "David Thompson",
            phone: "(555) 123-4570",
            content: "Our school would like to participate in your environmental cleanup initiative. We have about 25 students interested. What's the next step?",
            created_at: "2024-03-20 14:20:18",
            conversation_id: 4
        },
        {
            id: 5,
            sender_id: "Maria Sanchez",
            phone: "(555) 123-4571",
            content: "Thank you for accepting my volunteer application! I've completed the background check form. Please let me know if you need anything else from me.",
            created_at: "2024-03-20 11:05:33",
            conversation_id: 5
        }
    ];

    useEffect(() => {
        setMessages(DUMMY_MESSAGES);
    }, []);

    // 🔹 Función para formatear los mensajes y usarlos en la tabla
    const userList = (data, start, end) => {
        return data.slice(start, end).map(msg => ({
            id: msg.id,
            user_name: msg.sender_id,
            user_email: msg.phone,
            date: new Date(msg.created_at).toLocaleString(),
            message: msg.content || "No message content",
            user_status: "Pending",
            color: "warning",
        }));
    };

    return (
        <div className="col-xxl-12">
            <div className="card stretch stretch-full">
                <CardHeader title={title} />

                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                            <tr className="border-b">
                                <th scope="row">Sender</th>
                                <th>Message</th>
                                <th>Sent Date</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userList(messages, 0, 5).map(({ id, user_email, user_name, date, user_status, color, message }) => (
                                <tr key={id} className="chat-single-item">
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="text-white avatar-text user-avatar-text">
                                                {user_name.substring(0, 1)}
                                            </div>
                                            <a href="#">
                                                <span className="d-block">{user_name}</span>
                                                <span className="fs-12 d-block fw-normal text-muted">{user_email}</span>
                                            </a>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="d-block text-muted text-truncate" title={message}>
                                            {message.length > 50 ? message.substring(0, 50) + "..." : message}
                                        </span>
                                    </td>
                                    <td>{date}</td>
                                    <td>
                                        <span className={`badge bg-soft-${color} text-${color}`}>{user_status}</span>
                                    </td>
                                    <td className="text-end">
                                        <Link to="#"><FiMoreVertical size={16} /></Link>
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
        </div>
    );
};

export default PendingMessages;
