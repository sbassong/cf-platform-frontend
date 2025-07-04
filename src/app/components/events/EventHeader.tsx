'use client';

import { useSWRConfig } from 'swr';
import { useAuth } from '@/app/context/AuthContext';
import { rsvpToEvent, unRsvpFromEvent } from '@/lib/api';
import { Event as EventType } from '@/types';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, LogIn, LogOut } from 'lucide-react';

interface EventHeaderProps {
  event: EventType;
  onEdit: () => void;
}

export default function EventHeader({ event, onEdit }: EventHeaderProps) {
  const { user } = useAuth();
  const { mutate } = useSWRConfig();

  const isOrganizer = user?.profile?._id === event.organizer._id;
  const isAttending = event.attendees.some(
    (attendee) => attendee._id === user?.profile?._id
  );

  const handleRsvp = async () => {
    try {
      await rsvpToEvent(event._id);
      mutate(`/events/${event._id}`);
    } catch (error) {
      console.error('Failed to RSVP to event:', error);
    }
  };

  const handleUnRsvp = async () => {
    try {
      await unRsvpFromEvent(event._id);
      mutate(`/events/${event._id}`);
    } catch (error) {
      console.error('Failed to un-RSVP from event:', error);
    }
  };

  const renderActionButton = () => {
    if (isOrganizer) {
      return <Button variant="outline" onClick={onEdit}>Event Settings</Button>;
    }
    if (isAttending) {
      return (
        <Button variant="secondary" onClick={handleUnRsvp}>
          <LogOut className="mr-2 h-4 w-4" />
          I Can't Go
        </Button>
      );
    }
    return (
      <Button onClick={handleRsvp}>
        <LogIn className="mr-2 h-4 w-4" />
        RSVP
      </Button>
    );
  };

  return (
    <div className="border-b bg-background">
      {/* Event Image */}
      <div className="relative h-64 sm:h-80 w-full bg-muted">
        {event.imageUrl && (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          {/* Left Column: Details */}
          <div className="space-y-3">
            <p className="text-primary font-semibold text-sm">
              {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
            </p>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <div className="text-muted-foreground">
              <p>Organized by{' '}
                <Link href={`/profiles/${event.organizer.username}`} className="font-semibold text-foreground hover:underline">
                  {event.organizer.displayName}
                </Link>
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{event.attendeeCount} people attending</span>
              </div>
            </div>
          </div>

          {/* Right Column: Action Button */}
          {user && <div>{renderActionButton()}</div>}
        </div>
      </div>
    </div>
  );
}