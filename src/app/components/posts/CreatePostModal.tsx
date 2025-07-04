'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSWRConfig } from 'swr';
import { useAuth } from '@/app/context/AuthContext';
import { createPost, getPostImageUploadUrl } from '@/lib/api';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageIcon, Loader2 } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty.').max(500, 'Post cannot exceed 500 characters.'),
});

export default function CreatePostModal({ isOpen, onOpenChange }: CreatePostModalProps) {
  const { user } = useAuth();
  const { mutate } = useSWRConfig();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: '' },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let imageUrl: string | undefined = undefined;

    // Handle image upload if a file is selected
    if (imageFile) {
      try {
        const { uploadUrl, publicUrl } = await getPostImageUploadUrl(imageFile.type);
        await fetch(uploadUrl, { method: 'PUT', body: imageFile, headers: { 'Content-Type': imageFile.type } });
        imageUrl = publicUrl;
      } catch (error) {
        console.error("Image upload failed", error);
        // Optionally show an error to the user
        return;
      }
    }

    // then create the post
    try {
      await createPost({ ...values, imageUrl });
      // Revalidate the /posts endpoint to refresh the feed
      mutate('/posts');
      handleClose();
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  const handleClose = () => {
    form.reset();
    setImageFile(null);
    setImagePreview('');
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="flex items-start space-x-4 pt-4">
          <Avatar>
            <AvatarImage src={user.profile.avatarUrl} />
            <AvatarFallback>{user.profile.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="What's on your mind?"
                          className="w-full resize-none border-none focus-visible:ring-0 shadow-none p-0"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Image preview" className="rounded-md object-cover max-h-60 w-full" />
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
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}