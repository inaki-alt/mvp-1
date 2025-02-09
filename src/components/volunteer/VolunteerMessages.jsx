import React, { useState } from 'react';
import PerfectScrollbar from "react-perfect-scrollbar";
import ChatsUsers from '../chats/ChatsUsers';
import ChartsHeader from '../chats/ChatHeader';
import { chatMessageData } from '@/utils/fackData/chatMessageData';
import ChatMessage from '../chats/ChatMessage';
import MessageEditor from '../chats/MessageEditor';

const VolunteerMessages = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <ChatsUsers sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="content-area">
                <PerfectScrollbar>
                    <ChartsHeader setSidebarOpen={setSidebarOpen} />
                    <div className="content-area-body">
                        {chatMessageData.map(({ isReplay, messages, time, user_img, user_name, isTyping }, index) => (
                            <ChatMessage
                                key={index}
                                avatar={user_img}
                                name={user_name}
                                time={time}
                                messages={messages}
                                isReplay={isReplay}
                                isTyping={isTyping}
                            />
                        ))}
                    </div>
                    <MessageEditor />
                </PerfectScrollbar>
            </div>
        </>
    );
};

export default VolunteerMessages; 