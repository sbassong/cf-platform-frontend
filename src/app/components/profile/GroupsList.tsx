import Image from 'next/image';

const mockGroups = [
  {
    id: 1,
    name: 'PNW DINKs & Dogs',
    memberCount: 124,
    imageUrl: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=1935&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Sci-Fi Readers Collective',
    memberCount: 88,
    imageUrl: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=2071&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Amateur Chefs & Foodies',
    memberCount: 212,
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070&auto=format&fit=crop',
  },
];

// placeholder component to display a mock list of groups.
export default function GroupsList() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4  max-h-[700px] overflow-y-auto pr-2">
      {mockGroups.map((group) => (
        <div key={group.id} className="flex items-center space-x-4">
          <Image
            src={group.imageUrl}
            alt={group.name}
            width={50}
            height={50}
            className="rounded-lg object-cover"
          />
          <div>
            <h3 className="font-bold text-gray-800">{group.name}</h3>
            <p className="text-sm text-gray-500">{group.memberCount} members</p>
          </div>
        </div>
      ))}
    </div>
  );
}