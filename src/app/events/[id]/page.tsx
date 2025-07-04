'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Event as EventType } from '@/types';
import { Loader2 } from 'lucide-react';
import EventHeader from '@/app/components/events/EventHeader';
import EventTabs from '@/app/components/events/EventTabs'; 
import EditEventModal from '@/app/components/events/EditEventModal';

export default function EventDetailPage() {
  const params = useParams();
  const { id } = params;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: event,
    error,
    isLoading,
  } = useSWR<EventType>(id ? `/events/${id}` : null, fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>Failed to load event details or event not found.</p>
      </div>
    );
  }

  return (
    <>
      {event && (
        <EditEventModal
          event={event}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      )}
      <div>
        {event && <EventHeader event={event} onEdit={() => setIsEditModalOpen(true)} />}
        <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {event && <EventTabs event={event} />}
        </div>
      </div>
    </>
  );
}