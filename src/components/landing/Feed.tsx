"use client";

import { useState } from "react";
import { Post as PostType } from "@/types";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostCard from "../posts/PostCard";
import CreatePostModal from "../posts/CreatePostModal";


export default function Feed() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: posts,
    error,
    isLoading,
  } = useSWR<PostType[]>("/posts", fetcher);

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
        <p>Failed to load the feed. Please try again later.</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No posts to show right now. Why not create the first one?</p>
      </div>
    );
  }

  return (
    <>
      <CreatePostModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Home Feed</h1>
              <p className="text-muted-foreground">
                {"See what's new in your community."}
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>Create Post</Button>
          </div>

          {/* Post List */}
          <div className="space-y-6">
            {!posts || posts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>No posts to show right now. Why not create the first one?</p>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post._id} post={post} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
}
