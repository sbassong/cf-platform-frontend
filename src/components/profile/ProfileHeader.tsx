import Image from "next/image";
import { Profile } from "@/types";
import { useRouter } from "next/router";
import { UserPlus, MessageCircle, Edit, Camera, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSWRConfig } from "swr";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { followProfile, unfollowProfile } from "@/lib/api";
import SignOutButton from "./SignOutButton";

interface ProfileHeaderProps {
  profile: Profile;
  onEditClick: () => void;
  onAvatarEditClick: () => void;
  onBannerEditClick: () => void;
}

export default function ProfileHeader({
  profile,
  onEditClick,
  onAvatarEditClick,
  onBannerEditClick,
}: ProfileHeaderProps) {
  const { user: authenticatedUser } = useAuth();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const isOwner = authenticatedUser?.profile?._id === profile._id;
  // Determine if the authenticated user is following the viewed profile
  const isFollowing = authenticatedUser?.profile?.following?.includes(
    profile._id
  );

  const handleFollowToggle = async () => {
    if (!authenticatedUser) return router.push("/signin");

    try {
      if (isFollowing) {
        await unfollowProfile(profile._id);
      } else {
        await followProfile(profile._id);
      }
      // Revalidate both the viewed profile and the authenticated user's profile
      mutate(`/profiles/${profile.username}`);
      mutate(`/api/auth/session`);
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    }
  };

  return (
    <div className="border-b bg-background">
      {/* Banner Image Section */}
      <div className="relative h-48 w-full bg-gray-200 group">
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {isOwner && (
          <Button
            variant="secondary"
            size="icon"
            onClick={onBannerEditClick}
            className="absolute top-4 right-4 h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera size={20} />
          </Button>
        )}
      </div>

      {/* Main Profile Info */}
      <div className="p-4">
        <div className="">
          {/* Avatar and Name*/}
          <div className="relative -mt-20">
            <div className="relative h-32 w-32 border-4 border-white rounded-full group">
              <Avatar
                className="h-full w-full"
                onClick={isOwner ? onAvatarEditClick : undefined}
              >
                <AvatarImage
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                />
                <AvatarFallback>
                  {getInitials(profile.displayName)}
                </AvatarFallback>
              </Avatar>
              {isOwner && (
                <button
                  onClick={onAvatarEditClick}
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera size={24} />
                </button>
              )}
            </div>
          </div>

          {/* Details and Actions Section */}
          <div className="flex justify-between items-start flex-wrap">
            <div className="mt-2 mr-5">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {profile.displayName}
              </h1>
              <p className="text-sm text-gray-500">@{profile.username}</p>
              <div className="flex space-x-4 text-sm text-gray-500 mt-2">
                <span>
                  <span className="font-bold text-gray-900">
                    {profile.followersCount}
                  </span>{" "}
                  Followers
                </span>
                <span>
                  <span className="font-bold text-gray-900">
                    {profile.followingCount}
                  </span>{" "}
                  Following
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              {isOwner ? (
                <>
                  <Button
                    variant="outline"
                    onClick={onEditClick}
                    className="flex items-center space-x-2"
                  >
                    <Edit size={16} />
                    <span>Edit Profile</span>
                  </Button>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Button className="flex items-center space-x-2">
                    <MessageCircle size={16} />
                    <span>Message</span>
                  </Button>
                  <Button
                    variant={isFollowing ? "secondary" : "default"}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? (
                      <UserCheck size={16} className="mr-2" />
                    ) : (
                      <UserPlus size={16} className="mr-2" />
                    )}
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
