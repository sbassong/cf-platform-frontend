"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostsList from "./PostsLists";
import GroupsList from "./GroupsList";
import EventsList from "./EventsList";
import { Profile } from "@/types";

interface TabbedContentProps {
  profile: Profile;
}

export default function TabbedContent({ profile }: TabbedContentProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" data-cy="posts-tab">Posts</TabsTrigger>
          <TabsTrigger value="groups" data-cy="groups-tab">Groups</TabsTrigger>
          <TabsTrigger value="events" data-cy="events-tab">Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          <PostsList profileId={profile?._id} />
        </TabsContent>

        <TabsContent value="groups">
          <GroupsList profileId={profile?._id} />
        </TabsContent>

        <TabsContent value="events">
          <EventsList profileId={profile?._id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}