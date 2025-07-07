'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Group } from "@/types";
import GroupMembersList from "./GroupMembersList";
import GroupPostFeed from './GroupPostFeed';

interface GroupTabsProps {
  group: Group;
}

export default function GroupTabs({ group }: GroupTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <div className="py-6">
          <GroupPostFeed groupId={group._id} />
        </div>
      </TabsContent>
      <TabsContent value="members">
        <div className="py-6">
          <GroupMembersList members={group.members} owner={group.owner} />
        </div>
      </TabsContent>
    </Tabs>
  );
}