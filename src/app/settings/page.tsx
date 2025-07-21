"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSettingsForm from "@/components/settings/AccountSettingsForm";
import ProfileSettingsForm from "@/components/settings/ProfileSettingsForm";
import NotificationSettingsForm from "@/components/settings/NotificationSettingsForm";

export default function SettingsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettingsForm />
          </TabsContent>

          <TabsContent value="account">
            <AccountSettingsForm />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettingsForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
