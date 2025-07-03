import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Post as PostType } from "@/types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function PostCard({ post }: { post: PostType }) {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="w-full" data-cy={`post-${post._id}`}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Link href={`/profiles/${post.author.username}`}>
          <Avatar>
            <AvatarImage src={post.author.avatarUrl} alt={post.author.displayName} />
            <AvatarFallback>{getInitials(post.author.displayName)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="grid gap-1">
          <Link href={`/profiles/${post.author.username}`} className="font-semibold hover:underline">
            {post.author.displayName}
          </Link>
          <p className="text-sm text-muted-foreground">
            @{post.author.username} ·{' '}
            <time dateTime={post.createdAt}>
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </time>
          </p>
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
  );
}