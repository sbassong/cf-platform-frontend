import Image from "next/image";
import { Profile } from "@/types";
import { UserPlus, MessageCircle, Edit, Camera } from "lucide-react";

interface ProfileHeaderProps {
  profile: Profile;
  isOwner: boolean;
  onEditClick: () => void;
  onAvatarEditClick: () => void;
  onBannerEditClick: () => void;
}

export default function ProfileHeader({
  profile,
  isOwner,
  onEditClick,
  onAvatarEditClick,
  onBannerEditClick,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Banner Image */}
      <div className="relative h-48 w-full group">
        <Image
          src={
            profile.bannerUrl ||
            "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2p"
          }
          alt={`${profile.displayName}'s banner`}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
        {isOwner && (
          <button
            onClick={onBannerEditClick}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera size={20} />
          </button>
        )}
      </div>

      {/* Main Profile Info */}
      <div className="p-4">
        <div className="">
          {/* Avatar and Name */}
          <div className="relative -mt-20">
            <div className="relative h-32 w-32 border-4 border-white rounded-full group">
              <Image
                src={profile.avatarUrl || "/default-avatar.jpg"}
                alt={`${profile.displayName}'s avatar`}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
              {isOwner && (
                <button
                  onClick={onAvatarEditClick}
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Camera size={24} />
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-start flex-wrap">
            {/* Text Details */}
            <div className="mt-2 mr-5">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.displayName}
              </h1>
              <p className="text-sm text-gray-500">@{profile.username}</p>
              <div className="flex space-x-4 text-sm text-gray-500 mt-2">
                <span>
                  <span className="font-bold text-gray-900">148</span> Followers
                </span>
                <span>
                  <span className="font-bold text-gray-900">92</span> Following
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              {isOwner ? (
                <button
                  onClick={onEditClick}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                    <MessageCircle size={16} />
                    <span>Message</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                    <UserPlus size={16} />
                    <span>Follow</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
