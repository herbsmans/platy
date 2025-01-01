import React from 'react';
import { ChatHistory } from '../components/chat/ChatHistory';

export function ChatPage() {
  return (
    <div className="h-[calc(100vh-4rem)] -mt-6">
      <ChatHistory />
    </div>
  );
}