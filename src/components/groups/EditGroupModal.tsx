'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSWRConfig } from 'swr';
import { Group } from '@/types';
import { updateGroup, getGroupAvatarUploadUrl, getGroupBannerUploadUrl } from '@/lib/api';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface EditGroupModalProps {
  group: Group;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters.').max(500),
});

export default function EditGroupModal({ group, isOpen, onOpenChange }: EditGroupModalProps) {
  const { mutate } = useSWRConfig();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // State for image files and previews
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(group.avatarUrl || '');
  const [bannerPreview, setBannerPreview] = useState(group.bannerUrl || '');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: group.name, description: group.description },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ name: group.name, description: group.description });
      setAvatarPreview(group.avatarUrl || '');
      setBannerPreview(group.bannerUrl || '');
      setAvatarFile(null);
      setBannerFile(null);
    }
  }, [isOpen, group, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'avatar') {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updateData: { name: string; description: string; avatarUrl?: string; bannerUrl?: string; } = { ...values };

    try {
      // Use Promise.all to handle both uploads concurrently
      const [avatarUrl, bannerUrl] = await Promise.all([
        avatarFile ? handleImageUpload(avatarFile, getGroupAvatarUploadUrl) : Promise.resolve(undefined),
        bannerFile ? handleImageUpload(bannerFile, getGroupBannerUploadUrl) : Promise.resolve(undefined),
      ]);

      if (avatarUrl) updateData.avatarUrl = avatarUrl;
      if (bannerUrl) updateData.bannerUrl = bannerUrl;

      await updateGroup(group._id, updateData);
      mutate(`/groups/${group._id}`); // Revalidate the group data
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update group", error);
    }
  };

  const handleImageUpload = async (file: File, getUrlFn: (contentType: string) => Promise<{ uploadUrl: string; publicUrl: string; }>) => {
    const { uploadUrl, publicUrl } = await getUrlFn(file.type);
    await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
    return publicUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Group Settings</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Image Upload Section */}
            <div className="space-y-4">
              {/* Banner Upload */}
              <div>
                <FormLabel>Banner Image</FormLabel>
                <div className="mt-2 aspect-[3/1] w-full relative bg-muted rounded-md overflow-hidden">
                  {bannerPreview && <Image src={bannerPreview} alt="Banner preview" fill className="object-cover" />}
                  <Button type="button" variant="secondary" size="sm" className="absolute bottom-2 right-2" onClick={() => bannerInputRef.current?.click()}>
                    Change Banner
                  </Button>
                </div>
              </div>
              {/* Avatar Upload */}
              <div>
                <FormLabel>Group Avatar</FormLabel>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-20 w-20 relative rounded-md bg-muted overflow-hidden">
                    {avatarPreview && <Image src={avatarPreview} alt="Avatar preview" fill className="object-cover" />}
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={() => avatarInputRef.current?.click()}>
                    Change Avatar
                  </Button>
                </div>
              </div>
            </div>

            <input type="file" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" accept="image/*" />
            <input type="file" ref={bannerInputRef} onChange={(e) => handleFileChange(e, 'banner')} className="hidden" accept="image/*" />

            {/* Text Fields Section */}
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem> <FormLabel>Group Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem>)} />
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea {...field} rows={5} /></FormControl> <FormMessage /> </FormItem>)} />

            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}