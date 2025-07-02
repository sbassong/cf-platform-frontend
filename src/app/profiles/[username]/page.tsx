"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { Profile, Post as PostType } from "@/types";
import { useAuth } from "@/app/context/AuthContext";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import EditProfileModal from "@/app/components/profile/EditProfileModal";
import PostList from "@/app/components/posts/PostList";
import EventsList from "@/app/components/profile/EventsList";
import GroupsList from "@/app/components/profile/GroupsList";
import TabbedContent from "@/app/components/profile/TabbedContent";
import AvatarUploadModal from '@/app/components/profile/AvatarUploadModal';
import BannerUploadModal from '@/app/components/profile/BannerUploadModal';
import { Calendar, MapPin, User, Edit } from "lucide-react";
import { format } from "date-fns";

async function getProfileAndPosts(
  username: string
): Promise<{ profile: Profile; posts: PostType[] } | null> {
  try {
    const profileRes = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/profiles/${username}`,
      { cache: "no-store" }
    );
    if (!profileRes.ok) return null;
    const profile: Profile = await profileRes.json();

    const postsRes = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/posts/by-author/${profile._id}`,
      { cache: "no-store" }
    );
    const posts: PostType[] = await postsRes.json();

    return { profile, posts };
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    return null;
  }
}

export default function ProfilePage() {
  const params = useParams();
  const {username} = params
  const { user: authenticatedUser } = useAuth();
  const [profileData, setProfileData] = useState<{
    profile: Profile;
    posts: PostType[];
  } | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true);
      const data = await getProfileAndPosts(username);
      if (data) {
        setProfileData(data);
      } else {
        notFound();
      }
      setIsLoading(false);
    };
    if (username) {
      fetchData();
    }
  }, [username]);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfileData((prevData) =>
      prevData ? { ...prevData, profile: updatedProfile } : null
    );
  };

  if (isLoading || !profileData) {
    return <div>Loading profile...</div>; // May add a proper skeleton loader
  }

  const { profile, posts } = profileData;
  const isOwner = authenticatedUser?.profile._id === profile._id;

  // tabs and their content
  const tabs = [
    { label: "Posts", content: <PostList posts={posts} /> },
    { label: "Events", content: <EventsList /> },
    { label: "Groups", content: <GroupsList /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        onEditClick={() => setIsModalOpen(true)}
        onAvatarEditClick={() => setIsAvatarModalOpen(true)}
        onBannerEditClick={() => setIsBannerModalOpen(true)}
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (About, Info) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-900">About</h2>
              {isOwner && (
                <button onClick={() => setIsModalOpen(true)} className="text-gray-400 hover:text-indigo-600">
                  <Edit size={18} />
                </button>
              )}
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              {profile.bio && (
                <div className="text-base text-indigo-800 mb-4 flex items-center space-x-2">
                  <User size={16} />
                  <span>{profile.bio}</span>
                </div>
              )}

              {profile.location && (
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span>{profile.location}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-500" />
                <span>
                  Joined {format(new Date(profile.createdAt), "MMMM yyyy")}
                </span>
              </div>
            </div>
          </div>

          {profile.interests && profile.interests.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-gray-900">Interests</h2>
                {isOwner && (
                  <button onClick={() => setIsModalOpen(true)} className="text-gray-400 hover:text-indigo-600">
                    <Edit size={18} />
                  </button>
                )}
              </div>

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

      {isOwner && (
        <>
          <EditProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
          <AvatarUploadModal
            isOpen={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
          <BannerUploadModal
            isOpen={isBannerModalOpen}
            onClose={() => setIsBannerModalOpen(false)}
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        </>
      )}
    </div>
  );
}
