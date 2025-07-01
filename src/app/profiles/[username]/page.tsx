import { notFound } from 'next/navigation';
import { Profile, Post as PostType } from '@/types';
import ProfileHeader from '@/app/components/profile/ProfileHeader';
import PostList from '@/app/components/posts/PostList';
import EventsList from '@/app/components/profile/EventsList';
import GroupsList from '@/app/components/profile/GroupsList';
import TabbedContent from '@/app/components/profile/TabbedContent';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

async function getProfile(username: string): Promise<Profile | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/profiles/${username}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

async function getPostsByAuthor(profileId: string): Promise<PostType[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/posts/by-author/${profileId}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await getProfile(params?.username);

  if (!profile) {
    notFound();
  }

  const posts = await getPostsByAuthor(profile._id);

  // tabs and their content
  const tabs = [
    { label: 'Posts', content: <PostList posts={posts} /> },
    { label: 'Events', content: <EventsList /> },
    { label: 'Groups', content: <GroupsList /> },
    ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader profile={profile} />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (About, Info) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
            <div className="space-y-3 text-sm text-gray-700">
              {profile.location && (
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-500" />
                <span>
                  Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}
                </span>
              </div>
            </div>
          </div>
          {profile.interests && profile.interests.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

  
          <div className="md:col-span-2">
          <TabbedContent tabs={tabs} />
        </div>
      </div>
    </div>
  );
}