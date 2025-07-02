'use client';

import { useState, useRef } from 'react';
import { Profile } from '@/types';
import { X, Camera, Loader2 } from 'lucide-react';

interface BannerUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
}

export default function BannerUploadModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
}: BannerUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Use the dedicated banner endpoint
      const resUrl = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/profiles/banner-upload-url`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.type }),
      });
      const { uploadUrl, publicUrl } = await resUrl.json();

      const uploa = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      console.log({uploa})
      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/profiles/${profile._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bannerUrl: publicUrl }),
      });

      if (!updateRes.ok) throw new Error('Failed to update profile with new banner URL.');

      const updatedProfile = await updateRes.json();
      onProfileUpdate(updatedProfile);
      onClose();
    } catch (error) {
      console.error('Banner upload failed:', error);
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
        <h2 className="text-xl font-bold mb-4">Update Banner Image</h2>
        <p className="text-sm text-gray-500 mb-6">Choose an image that represents you.</p>
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