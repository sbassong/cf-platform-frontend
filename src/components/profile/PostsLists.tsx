"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { Post as PostType } from "@/types";
import { Loader2 } from "lucide-react";
import PostCard from "../posts/PostCard";

interface PostListProps {
  profileId: string;
}

export default function PostList({ profileId }: PostListProps) {
  const {
    data: posts,
    error,
    isLoading,
  } = useSWR<PostType[]>(`/posts/by-author/${profileId}`, fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Could not load posts.</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
        <p>This user hasn't posted anything yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}