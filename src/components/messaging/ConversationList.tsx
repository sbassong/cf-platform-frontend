'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Conversation, Profile } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export default function ConversationList({ selectedConversationId, onSelectConversation }: ConversationListProps) {
  const { data: conversations, isLoading } = useSWR<Conversation[]>('/messaging/conversations', fetcher);
  const { user } = useAuth();

  const getOtherParticipant = (participants: Profile[]) => {
    return participants.find(p => p._id !== user?.profile._id);
  };

  return (
    <div className="flex flex-col gap-2 p-2 border-r">
      <h2 className="text-xl font-bold p-2">Messages</h2>
      {isLoading && <p>Loading...</p>}
      {conversations?.map((convo) => {
        const otherUser = getOtherParticipant(convo.participants);
        if (!otherUser) return null;
        return (
          <div
            key={convo._id}
            onClick={() => onSelectConversation(convo._id)}
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted',
              selectedConversationId === convo._id && 'bg-muted'
            )}
          >
            <Avatar>
              <AvatarImage src={otherUser.avatarUrl} />
              <AvatarFallback>{otherUser.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{otherUser.displayName}</p>
              <p className="text-sm text-muted-foreground truncate">{convo.lastMessage?.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}