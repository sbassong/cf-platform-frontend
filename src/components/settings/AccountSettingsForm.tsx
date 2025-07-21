'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { changePassword } from '@/lib/api'

const formSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }),
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "New password must be different from the current password.",
  path: ["newPassword"],
});

export default function AccountSettingsForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await changePassword(values);
      toast.success("Success!", {
        description: "Your password has been changed successfully.",
      });
      form.reset();
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to change password.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password here. It's recommended to use a strong, unique password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}