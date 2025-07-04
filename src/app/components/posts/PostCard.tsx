import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trash2,
  Edit,
} from "lucide-react";
import { Post as PostType } from "@/types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { deletePost } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { useSWRConfig } from "swr";
import EditPostModal from "./EditPostModal";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PostCard({ post }: { post: PostType }) {
  const { user } = useAuth();
  const { mutate } = useSWRConfig();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOwner = user?.profile?._id === post.author._id;

  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      // Optimistically update the UI by revalidating the feed
      mutate("/posts");
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <EditPostModal
        post={post}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
      <Card className="w-full" data-cy={`post-${post._id}`}>
        <CardHeader className="flex flex-row items-center gap-4">
          <Link href={`/profiles/${post.author.username}`}>
            <Avatar>
              <AvatarImage
                src={post.author.avatarUrl}
                alt={post.author.displayName}
              />
              <AvatarFallback>
                {getInitials(post.author.displayName)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="grid gap-1">
            <Link
              href={`/profiles/${post.author.username}`}
              className="font-semibold hover:underline"
            >
              {post.author.displayName}
            </Link>
            <p className="text-sm text-muted-foreground">
              @{post.author.username} ·{" "}
              <time dateTime={post.createdAt}>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </time>
            </p>
          </div>

          {/* dropdown menu for owner only */}
          <div className="ml-auto">
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      // setTimeout fix to prevent dropdown event
                      // from triggering edit modal immediately
                      setTimeout(() => {
                        setIsEditModalOpen(true);
                      }, 0);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* FIX: Nest the AlertDialog within the DropdownMenu */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {/* This item now just acts as a trigger */}
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()} // Prevent default closing behavior
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <p className="whitespace-pre-wrap">{post.content}</p>
          {post.imageUrl && (
            <div className="mt-4 relative aspect-video w-full">
              <Image
                src={post?.imageUrl}
                alt="Post image"
                fill
                className="rounded-md object-cover"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-start gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-red-500/10 hover:text-red-500"
            data-cy="like-button"
          >
            <Heart size={16} />
            <span>{post.likesCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-blue-500/10 hover:text-blue-500"
            data-cy="comment-button"
          >
            <MessageCircle size={16} />
            <span>{post.commentsCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-green-500/10 hover:text-green-700"
            data-cy="share-button"
          >
            <Share2 size={16} />
          </Button>
        </CardFooter>
      </Card>

      {/* <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  );
}
