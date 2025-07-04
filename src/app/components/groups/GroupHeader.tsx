'use client';

import { useSWRConfig } from 'swr';
import { useAuth } from '@/app/context/AuthContext';
import { joinGroup, leaveGroup } from '@/lib/api';
import { Group } from '@/types';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, LogIn, LogOut, Settings } from 'lucide-react';

interface GroupHeaderProps {
  group: Group;
  onEdit: () => void;
}

export default function GroupHeader({ group, onEdit }: GroupHeaderProps) {
  const { user } = useAuth();
  const { mutate } = useSWRConfig();

  console.log({ group })

  // Determine user's status within the group
  const isOwner = user?.profile?._id === group.owner._id;
  const isMember = group.members.some(
    (member) => member._id === user?.profile?._id,
  );

  const handleJoin = async () => {
    try {
      await joinGroup(group._id);
      // Revalidate the group data to update the UI
      mutate(`/groups/${group._id}`);
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveGroup(group._id);
      mutate(`/groups/${group._id}`);
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  };

  const renderActionButton = () => {
    if (isOwner) {
      return (
        <Button variant="outline" onClick={onEdit}>
          <Settings className="mr-2 h-4 w-4" />
          Group Settings
        </Button>
      );
    }
    if (isMember) {
      return (
        <Button variant="secondary" onClick={handleLeave}>
          <LogOut className="mr-2 h-4 w-4" />
          Leave Group
        </Button>
      );
    }
    return (
      <Button onClick={handleJoin}>
        <LogIn className="mr-2 h-4 w-4" />
        Join Group
      </Button>
    );
  };

  return (
    <div className="border-b bg-background">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-muted">
        {group.bannerUrl && (
          <Image
            src={group.bannerUrl}
            alt={`${group.name} banner`}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5 -mt-16 sm:-mt-20">
          <Avatar className="h-32 w-32 rounded-lg border-4 border-background bg-muted sm:h-40 sm:w-40">
            <AvatarImage src={group.avatarUrl} alt={group.name} />
            <AvatarFallback>
              <Users className="h-16 w-16" />
            </AvatarFallback>
          </Avatar>
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:pb-1 flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">{group.name}</h1>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Users className="h-4 w-4 mr-1" />
                <span>{group.memberCount} members</span>
              </div>
            </div>
            {user && <div className="mt-4 sm:mt-0">{renderActionButton()}</div>}
          </div>
        </div>
        <p className="mt-4 text-sm text-foreground/90">{group.description}</p>
      </div>
    </div>
  );
}