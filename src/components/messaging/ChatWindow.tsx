'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Message, Profile } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useMessagingSocket } from '@/hooks/use-messaging-socket';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  conversationId: string;
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const { sendMessage } = useMessagingSocket(conversationId);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useSWR<Message[]>(
    `/messaging/conversations/${conversationId}/messages`,
    fetcher
  );

  useEffect(() => {
    // Scroll to the bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
    }
  }, [messages]);

  const handleSend = () => {
    if (content.trim()) {
      sendMessage(content);
      setContent('');
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-full">Loading chat...</div>;

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
        <div className="space-y-4">
          {messages?.map((msg) => {
            const isOwnMessage = msg.sender._id === user?.profile._id;
            return (
              <div key={msg._id} className={cn("flex items-end gap-2", isOwnMessage && "justify-end")}>
                {!isOwnMessage && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.sender.avatarUrl} />
                    <AvatarFallback>{msg.sender.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-xs md:max-w-md p-3 rounded-lg",
                    isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
          />
          <Button onClick={handleSend}><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}