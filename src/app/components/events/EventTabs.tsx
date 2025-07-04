'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event as EventType } from "@/types";
import AttendeeList from "./AttendeeList";
import { Card, CardContent } from "@/components/ui/card";

interface EventTabsProps {
  event: EventType;
}

export default function EventTabs({ event }: EventTabsProps) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="attendees">Attendees ({event.attendeeCount})</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <Card>
          <CardContent className="py-6">
            <p className="text-foreground/90 whitespace-pre-wrap">{event.description}</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="attendees">
        <Card>
          <CardContent className="py-6">
            <AttendeeList attendees={event.attendees} organizer={event.organizer} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}