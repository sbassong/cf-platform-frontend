"use client";

import { useState, useRef } from "react";
import { useSWRConfig } from "swr";
import { Profile } from "@/types";
import { Camera, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BannerUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
}

export default function BannerUploadModal({
  isOpen,
  onClose,
  profile,
}: BannerUploadModalProps) {
  const { mutate } = useSWRConfig();

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Use the dedicated banner endpoint
      const resUrl = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/profiles/banner-upload-url`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentType: file.type }),
        }
      );
      const { uploadUrl, publicUrl } = await resUrl.json();

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const updateRes = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/profiles/${profile._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ bannerUrl: publicUrl }),
        }
      );

      if (!updateRes.ok)
        throw new Error("Failed to update profile with new banner URL.");

      mutate(`/profiles/${profile.username}`);
      onClose();
    } catch (error) {
      console.error("Banner upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle>Update Banner Image</DialogTitle>
          <DialogDescription>
            Choose an image that represents you.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
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
            <span>{isUploading ? "Uploading..." : "Upload New Photo"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
