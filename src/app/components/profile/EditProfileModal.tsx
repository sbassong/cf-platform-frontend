'use client';

import { useState, useEffect, KeyboardEvent, FormEvent } from 'react';
import { Profile } from '@/types';
import { X } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
}: EditProfileModalProps) {
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [currentInterest, setCurrentInterest] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setInterests(profile.interests || []);
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleInterestKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInterest) {
      e.preventDefault();
      if (!interests.includes(currentInterest.trim())) {
        setInterests([...interests, currentInterest.trim()]);
      }
      setCurrentInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter((i) => i !== interestToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedData = {
      bio,
      location,
      interests,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/profiles/${profile._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updatedData),
        },
      );

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await res.json();
      console.log({updatedProfile})
      onProfileUpdate(updatedProfile);
      onClose();
    } catch (error) {
      console.error(error);
      // Handle error display to the user
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background bg-opacity-20 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-indigo-600 font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-indigo-800"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-indigo-800" 
            />
          </div>
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700">Interests</label>
            <div className="mt-1 flex flex-wrap gap-2 border border-gray-300 rounded-md p-2">
              {interests.map((interest) => (
                <span key={interest} className="flex items-center bg-indigo-100 text-indigo-700 text-sm font-medium px-2 py-1 rounded-full">
                  {interest}
                  <button type="button" onClick={() => removeInterest(interest)} className="ml-2 text-indigo-500 hover:text-indigo-700">
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={currentInterest}
                onChange={(e) => setCurrentInterest(e.target.value)}
                onKeyDown={handleInterestKeyDown}
                placeholder="Type and press Enter"
                className="flex-grow outline-none text-indigo-800"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}