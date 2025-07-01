import Image from 'next/image';
import Link from 'next/link';
import { Post as PostType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-center mb-3">
        <Link href={`/profiles/${post.author.username}`}>
          <Image
            src={post.author.avatarUrl || '/default-avatar.png'}
            alt={`${post.author.displayName}'s avatar`}
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
        </Link>
        <div className="flex-grow">
          <Link
            href={`/profiles/${post.author.username}`}
            className="font-bold text-gray-800 hover:underline"
          >
            {post.author.displayName}
          </Link>
          <p className="text-sm text-gray-500">
            @{post.author.username} ·{' '}
            <time dateTime={post.createdAt}>{timeAgo}</time>
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-700 whitespace-pre-wrap mb-3">
        {post.content}
      </p>

      {/* Post Image (if it exists) */}
      {post.imageUrl && (
        <div className="relative w-full h-80 rounded-lg overflow-hidden mb-3">
          <Image
            src={post.imageUrl}
            alt="Post image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center text-gray-500">
        <button className="flex items-center space-x-2 hover:text-red-500 transition-colors p-2 rounded-full">
          <Heart size={20} />
          <span>{post.likesCount > 0 && post.likesCount}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors ml-4 p-2 rounded-full">
          <MessageCircle size={20} />
          <span>{post.commentsCount > 0 && post.commentsCount}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-green-500 transition-colors ml-4 p-2 rounded-full">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}