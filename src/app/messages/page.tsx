'use client';

import { useState, useEffect } from 'react';
import ConversationList from '../../components/messaging/ConversationList';
import ChatWindow from '../../components/messaging/ChatWindow';
import StartConversationModal from '@/components/messaging/StartConversationModal';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function MessagesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const initialConversationId = searchParams.get('id');

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // ensures chat is selected if user navigates here directly
    if (initialConversationId) {
      setSelectedConversationId(initialConversationId);
    }
  }, [initialConversationId]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    router.push(`${pathname}?id=${conversationId}`);
  };

  return (
    <>
      <StartConversationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConversationSelect={handleSelectConversation}
      />
      <div className="h-[calc(100vh-3.5rem)] grid grid-cols-[300px_1fr] border-t">
        <aside className="flex flex-col mt-2">
          <div className="p-2 border-b">
            <Button variant="outline" className="w-full" onClick={() => setIsModalOpen(true)}>
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>
          <ConversationList
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </aside>
        <main className="h-full">
          {selectedConversationId ? (
            <ChatWindow conversationId={selectedConversationId} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}