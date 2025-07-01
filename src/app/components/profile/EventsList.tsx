import { Calendar, MapPin } from 'lucide-react';

const mockEvents = [
  {
    id: 1,
    name: 'Childfree Hikers Monthly Meetup',
    date: 'July 12, 2025',
    location: 'Mount Rainier National Park',
  },
  {
    id: 2,
    name: 'Board Game Cafe Takeover',
    date: 'July 25, 2025',
    location: 'The Round Table Cafe',
  },
];

// placeholder component to display a mock list of events.
export default function EventsList() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      {mockEvents.map((event) => (
        <div key={event.id} className="border-b border-gray-200 pb-4 last:border-b-0">
          <h3 className="font-bold text-indigo-700">{event.name}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
            <span className="flex items-center">
              <Calendar size={14} className="mr-1.5" /> {event.date}
            </span>
            <span className="flex items-center">
              <MapPin size={14} className="mr-1.5" /> {event.location}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}