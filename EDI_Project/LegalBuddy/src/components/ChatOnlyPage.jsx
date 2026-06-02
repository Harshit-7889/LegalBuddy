import React from 'react';
import ChatAccess from './ChatAccess';
import { useAuth } from '../context/AuthContext';

// This page will provide a home for the ChatAccess component
export default function ChatOnlyPage() {
    const { user } = useAuth();
    const role = user ? user.role : 'guest';
    // Mock quota for the component
    const quota = { uploadsRemaining: 0, uploadsTotal: 0, chatsRemaining: 10, chatsTotal: 10 };

    return (
        <div className="py-12">
            <ChatAccess role={role} quota={quota} />
        </div>
    );
}
