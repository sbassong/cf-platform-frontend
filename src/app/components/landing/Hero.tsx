import Link from 'next/link';

// Mock data for the animated mini-feed
const feedItems = [
  'New Post: "Just came back from a solo trip to Japan!"',
  'New Event: "Childfree Hikers Monthly Meetup"',
  'New Group: "Amateur Chefs & Foodies"',
  'New Post: "Thinking about hosting a board game night..."',
];

export default function Hero() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Column: Headline and CTA */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Find Your People,</span>
              <span className="block text-indigo-600">Live Your Passion.</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
              The vibrant social hub for child-free adults. See what's
              happening right now and join the conversation.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center md:justify-start">
              <div className="rounded-md shadow">
                <Link
                  href="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Join the Conversation
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Mini-Feed */}
          <div className="hidden md:block">
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {feedItems.map((item, index) => (
                    <li key={index} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
                            {item.split(' ')[1].charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}