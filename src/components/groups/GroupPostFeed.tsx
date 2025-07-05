'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Post } from '@/types';
import { Loader2 } from 'lucide-react';
import PostCard from '@/components/posts/PostCard';

interface GroupPostFeedProps {
  groupId: string;
}

export default function GroupPostFeed({ groupId }: GroupPostFeedProps) {
  const {
    data: posts,
    error,
    isLoading,
  } = useSWR<Post[]>(`/posts/by-group/${groupId}`, fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !posts || posts.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        <p>No posts in this group yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}