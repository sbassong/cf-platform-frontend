'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Group } from '@/types';
import { Loader2 } from 'lucide-react';
import { GroupCard } from '@/components/groups/GroupCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GroupsPage() {
  const { data: groups, error, isLoading } = useSWR<Group[]>('/groups', fetcher);

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover Groups</h1>
          <p className="text-muted-foreground">
            Find communities that share your interests and passions.
          </p>
        </div>
        <Link href="/groups/create">
          <Button>Create Group</Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="text-center py-20 text-red-500">
          <p>Failed to load groups. Please try again later.</p>
        </div>
      )}

      {/* Content: Grid of Groups */}
      {groups && (
        <>
          {groups.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No groups have been created yet. Be the first!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groups.map((group) => (
                <GroupCard key={group._id} group={group} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}