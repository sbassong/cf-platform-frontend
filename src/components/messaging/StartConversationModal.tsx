'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';
import { findOrCreateConversation, searchProfiles } from '@/lib/api';
import { Profile } from '@/types';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface StartConversationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationSelect: (conversationId: string) => void;
}

export default function StartConversationModal({ isOpen, onOpenChange, onConversationSelect }: StartConversationModalProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);

  const { data: searchResults, isLoading } = useSWR<Profile[]>(
    debouncedQuery ? `/profiles/search?q=${debouncedQuery}` : null,
    () => searchProfiles(debouncedQuery)
  );

  const handleSelectProfile = async (profile: Profile) => {
    try {
      const conversation = await findOrCreateConversation(profile._id);
      console.log({conversation})
      onOpenChange(false);
      onConversationSelect(conversation._id); // Select the new conversation
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Search for people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ScrollArea className="h-72 mt-4">
            {isLoading && <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin" /></div>}
            <div className="space-y-1">
              {searchResults?.length && searchResults?.map((profile) => (
                <div
                  key={profile._id}
                  onClick={() => handleSelectProfile(profile)}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted"
                >
                  <Avatar>
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback>{getInitials(profile.displayName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{profile.displayName}</p>
                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}