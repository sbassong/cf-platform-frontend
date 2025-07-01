import Image from 'next/image';

const featuredItems = [
  {
    type: 'Group',
    name: 'PNW DINKs & Dogs',
    imageUrl: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=1935&auto=format&fit=crop',
    stat: '124 Members',
  },
  {
    type: 'Event',
    name: 'Childfree Hikers Meetup',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop',
    stat: 'July 12, 2025',
  },
  {
    type: 'Group',
    name: 'Sci-Fi Readers Collective',
    imageUrl: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=2071&auto=format&fit=crop',
    stat: '88 Members',
  },
  {
    type: 'Event',
    name: 'Board Game Cafe Takeover',
    imageUrl: 'https://images.unsplash.com/photo-1585502334829-5f2b053b5a13?q=80&w=2070&auto=format&fit=crop',
    stat: 'July 25, 2025',
  },
];

export default function FeaturedContent() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          Explore Popular Groups & Events
        </h2>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {featuredItems.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-40 w-full">
                <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-indigo-600">{item.type}</p>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.stat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}