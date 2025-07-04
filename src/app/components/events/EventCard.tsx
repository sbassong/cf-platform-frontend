import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { Event as EventType } from "@/types";
import { format } from 'date-fns';
import Link from "next/link";
import Image from "next/image";

interface EventCardProps {
  event: EventType;
}

export function EventCard({ event }: EventCardProps) {


  return (
    <Link href={`/events/${event._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-40 w-full bg-muted">
          <Image
            src={event.imageUrl || ""}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">{event.attendeeCount} people attending</p>
        </CardFooter>
      </Card>
    </Link>
  );
}