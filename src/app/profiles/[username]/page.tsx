"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { Profile } from "@/types";
import { useAuth } from "@/app/context/AuthContext";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import EditProfileModal from "@/app/components/profile/EditProfileModal";
import TabbedContent from "@/app/components/profile/TabbedContent";
import AvatarUploadModal from "@/app/components/profile/AvatarUploadModal";
import BannerUploadModal from "@/app/components/profile/BannerUploadModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Edit } from "lucide-react";
import { format } from "date-fns";

async function getProfileData(username: string): Promise<Profile | null> {
  try {
    const profileRes = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/profiles/${username}`,
      { cache: "no-store" }
    );
    if (!profileRes.ok) return null;
    return await profileRes.json();
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    return null;
  }
}

export default function ProfilePage() {
  const params = useParams();
  const { username } = params;
  const { user: authenticatedUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (username) {
      const fetchData = async () => {
        setIsLoading(true);
        const data = await getProfileData(username);
        if (data) {
          setProfile(data);
        } else {
          notFound();
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [username]);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  if (isLoading || !profile) {
    return <div>Loading profile...</div>; // May add a proper skeleton loader
  }

  const isOwner = authenticatedUser?.profile._id === profile._id;

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        onEditClick={() => setIsEditModalOpen(true)}
        onAvatarEditClick={() => setIsAvatarModalOpen(true)}
        onBannerEditClick={() => setIsBannerModalOpen(true)}
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (About, Info) */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>About</CardTitle>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit size={16} />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {profile.bio && (
                <p className="text-foreground flex items-start gap-2">
                  <User size={16} className="mt-1 text-primary" />
                  <span>{profile.bio}</span>
                </p>
              )}
              {profile.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} className="text-primary" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} className="text-primary" />
                <span>
                  Joined {format(new Date(profile.createdAt), "MMMM yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>

          {profile.interests && profile.interests.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Interests</CardTitle>
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit size={16} />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <Badge
                    key={interest}
                    className="bg-primary/10 text-primary px-3 py-1 hover:bg-primary/20"
                  >
                    {interest}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (Tabs) */}
        <div className="md:col-span-2">
          <TabbedContent profile={profile} />
        </div>
      </div>

      {/* Modals */}
      {isOwner && (
        <>
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
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
