"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSWRConfig } from "swr";
import { Post as PostType } from "@/types";
import { updatePost, getPostImageUploadUrl } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon, X } from "lucide-react";

interface EditPostModalProps {
  post: PostType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  content: z
    .string()
    .min(1, "Post content cannot be empty.")
    .max(500, "Post cannot exceed 500 characters."),
});

export default function EditPostModal({
  post,
  isOpen,
  onOpenChange,
}: EditPostModalProps) {
  const { mutate } = useSWRConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    post.imageUrl || null
  );
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: post.content,
    },
  });

  // reset form whenever the modal is opened/closed or post changes
  useEffect(() => {
    if (isOpen) {
      form.reset({ content: post.content });
      setImageFile(null);
      setImagePreview(post.imageUrl || null);
      setIsImageRemoved(false);
    }
  }, [isOpen, post, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setIsImageRemoved(false); // A new file is selected, so it's not "removed"
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setIsImageRemoved(true);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let imageUrl: string | null | undefined = post.imageUrl;

    // either A new image was uploaded
    if (imageFile) {
      try {
        const { uploadUrl, publicUrl } = await getPostImageUploadUrl(
          imageFile.type
        );
        await fetch(uploadUrl, {
          method: "PUT",
          body: imageFile,
          headers: { "Content-Type": imageFile.type },
        });
        imageUrl = publicUrl;
      } catch (error) {
        console.error("Image upload failed", error);
        return;
      }
    }
    // or the existing image was removed
    else if (isImageRemoved) {
      imageUrl = null;
    }

    try {
      await updatePost(post._id, { content: values.content, imageUrl });
      mutate("/posts");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update post", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind?"
                      className="w-full resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Preview and Edit Section */}
            {imagePreview && (
              <div className="relative group">
                <Image
                  src={imagePreview}
                  alt="Post image preview"
                  width={500}
                  height={300}
                  className="rounded-md object-cover max-h-60 w-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <DialogFooter className="justify-between border-t pt-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />

              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
