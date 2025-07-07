"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { Event as EventType } from "@/types";
import { Loader2 } from "lucide-react";
import { EventCard } from "../events/EventCard";

interface EventsListProps {
  profileId: string;
}

export default function EventsList({ profileId }: EventsListProps) {
  const { data: events, error, isLoading } = useSWR<EventType[]>(
    `/events/by-participant/${profileId}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !events || events.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        <p>{"This user isn't attending any upcoming events."}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}