'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Group } from '@/types';
import { Loader2 } from 'lucide-react';
import GroupHeader from '@/app/components/groups/GroupHeader';
import GroupTabs from '@/app/components/groups/GroupTabs';
import EditGroupModal from '@/app/components/groups/EditGroupModal'; 

export default function GroupDetailPage() {
  const params = useParams();
  const { id } = params;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: group,
    error,
    isLoading,
  } = useSWR<Group>(id ? `/groups/${id}` : null, fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>Failed to load group details or group not found.</p>
      </div>
    );
  }

  return (
    <>
      {group && (
        <EditGroupModal
          group={group}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      )}
      <div>
        {group && <GroupHeader group={group} onEdit={() => setIsEditModalOpen(true)} />}
        <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {group && <GroupTabs group={group} />}
        </div>
      </div>
    </>
  );
}