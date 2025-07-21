'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useSWRConfig } from 'swr';
import { updateProfile } from '@/lib/api';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Define the validation schema for the form
const formSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters.').max(50),
  bio: z.string().max(160, 'Bio cannot exceed 160 characters.').optional(),
  location: z.string().max(100, 'Location cannot exceed 100 characters.').optional(),
});

export default function ProfileSettingsForm() {
  const { user } = useAuth();
  const { mutate } = useSWRConfig();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: user?.profile?.displayName || '',
      bio: user?.profile?.bio || '',
      location: user?.profile?.location || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.profile) return;

    try {
      await updateProfile(user.profile._id, values);
      mutate('/auth/session');
      mutate(`/profiles/${user.profile?.username}`);

      // Use the new, simpler sonner API
      toast.success("Success!", {
        description: "Your profile has been updated.",
      });
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to update profile.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Profile</CardTitle>
        <CardDescription>
          This information will be displayed on your profile page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief bio about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Denver, CO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}