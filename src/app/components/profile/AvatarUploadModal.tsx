'use client';

import { useState, useRef } from 'react';
import { Profile } from '@/types';
import Image from 'next/image';
import { X, Camera, Loader2 } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4">Update Profile Picture</h2>
        <Image
          src={profile.avatarUrl || '/default-avatar.png'}
          alt="Current avatar"
          width={120}
          height={120}
          className="rounded-full object-cover mx-auto mb-6"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/jpeg, image/png"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
        >
          {isUploading ? (
            <Loader2 size={20} className="animate-spin mr-2" />
          ) : (
            <Camera size={20} className="mr-2" />
          )}
          <span>{isUploading ? 'Uploading...' : 'Upload New Photo'}</span>
        </button>
      </div>
    </div>
  );
}