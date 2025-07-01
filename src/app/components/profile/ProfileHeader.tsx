import Image from 'next/image';
import { Profile } from '@/types';
import { UserPlus, MessageCircle } from 'lucide-react';

interface ProfileHeaderProps {
  profile: Profile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Banner Image */}
      <div className="relative h-48 w-full">
        <Image
          src="/reve-expanded.jpeg"
          alt={`${profile.displayName}'s banner`}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Main Profile Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          {/* Avatar and Name */}
          <div className="relative -mt-20">
            <div className="relative h-32 w-32 border-4 border-white rounded-full">
              <Image
                src={profile.avatarUrl || '/default-avatar.png'}
                alt={`${profile.displayName}'s avatar`}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <button className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              <MessageCircle size={16} />
              <span>Message</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
              <UserPlus size={16} />
              <span>Follow</span>
            </button>
          </div>
        </div>

        {/* Text Details */}
        <div className="mt-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {profile.displayName}
          </h1>
          <p className="text-sm text-gray-500">@{profile.username}</p>
          {profile.bio && (
            <p className="text-gray-700 mt-2">{profile.bio}</p>
          )}
          <div className="flex space-x-4 text-sm text-gray-500 mt-2">
            <span>
              <span className="font-bold text-gray-900">148</span> Followers
            </span>
            <span>
              <span className="font-bold text-gray-900">92</span> Following
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}