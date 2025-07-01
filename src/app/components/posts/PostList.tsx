import { Post as PostType } from '@/types';
import Post from './Post';

interface PostListProps {
  posts: PostType[];
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
        <p>{"This user hasn't posted anything yet."}</p>
      </div>
    );
  }

  return (
    <div className=' max-h-[700px] overflow-y-auto pr-2'>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}