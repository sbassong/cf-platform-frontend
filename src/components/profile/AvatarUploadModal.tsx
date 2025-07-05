'use client';

import { useState, useRef } from 'react';
import { Profile } from '@/types';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
}

export default function AvatarUploadModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
}: AvatarUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Get pre-signed URL from our backend
      const resUrl = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/profiles/avatar-upload-url`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.type }),
      });
      const { uploadUrl, publicUrl } = await resUrl.json();

      // 2. Upload file directly to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      // 3. Update the profile on our backend with the new publicUrl
      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/profiles/${profile._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ avatarUrl: publicUrl }),
      });

      if (!updateRes.ok) throw new Error('Failed to update profile with new avatar URL.');

      const updatedProfile = await updateRes.json();
      onProfileUpdate(updatedProfile);
      onClose();
    } catch (error) {
      console.error('Avatar upload failed:', error);
      // Optionally show an error message to the user
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="relative h-32 w-32">
            <Image
              src={profile.avatarUrl || '/default-avatar.png'}
              alt="Current avatar"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpeg, image/png"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Camera className="mr-2 h-4 w-4" />
            )}
            <span>{isUploading ? 'Uploading...' : 'Upload New Photo'}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}