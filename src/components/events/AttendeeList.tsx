'use client';

import { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

interface AttendeeListProps {
  attendees: Profile[];
  organizer: Profile;
}

export default function AttendeeList({ attendees, organizer }: AttendeeListProps) {
  // Combine organizer and other attendees, ensuring no duplicates
  const allAttendees = [organizer, ...attendees.filter(a => a._id !== organizer._id)];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {allAttendees.map((attendee) => (
        <Link href={`/profiles/${attendee.username}`} key={attendee._id}>
          <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
            <Avatar>
              <AvatarImage src={attendee.avatarUrl} alt={attendee.displayName} />
              <AvatarFallback>{getInitials(attendee.displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{attendee.displayName}</p>
              <p className="text-sm text-muted-foreground">@{attendee.username}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}