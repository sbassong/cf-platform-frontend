"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { Group } from "@/types";
import { Loader2 } from "lucide-react";
import { GroupCard } from "../groups/GroupCard";

interface GroupsListProps {
  profileId: string;
}

export default function GroupsList({ profileId }: GroupsListProps) {
  const { data: groups, error, isLoading } = useSWR<Group[]>(
    `/groups/by-author/${profileId}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !groups || groups.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        <p>{"This user hasn't joined or created any groups yet."}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <GroupCard key={group._id} group={group} />
      ))}
    </div>
  );
}