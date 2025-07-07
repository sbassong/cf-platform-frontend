'use client';

import { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

interface GroupMembersListProps {
  members: Profile[];
  owner: Profile;
}

export default function GroupMembersList({ members, owner }: GroupMembersListProps) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[owner, ...members.filter(m => m._id !== owner._id)].map((member) => (
        <Link href={`/profiles/${member.username}`} key={member._id}>
          <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
            <Avatar>
              <AvatarImage src={member.avatarUrl} alt={member.displayName} />
              <AvatarFallback>{getInitials(member.displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{member.displayName}</p>
              <p className="text-sm text-muted-foreground">@{member.username}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}