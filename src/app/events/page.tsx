'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Event as EventType } from '@/types';
import { Loader2 } from 'lucide-react';
import { EventCard } from '@/app/components/events/EventCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EventsPage() {
  const { data: events, error, isLoading } = useSWR<EventType[]>('/events', fetcher);

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
          <p className="text-muted-foreground">
            Discover meetups and activities in your community.
          </p>
        </div>
        <Link href="/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20 text-red-500">
          <p>Failed to load events. Please try again later.</p>
        </div>
      )}

      {/* Content: Grid of Events */}
      {events && (
        <>
          {events.length === 0 ? (
            // Empty State
            <div className="text-center py-20 text-gray-500">
              <p>No events have been scheduled yet. Be the first to create one!</p>
            </div>
          ) : (
            // Events Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}