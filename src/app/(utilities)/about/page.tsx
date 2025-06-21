import Image from 'next/image'; // Using the optimized Image component from Next.js
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block text-indigo-600">cf app</span>
          </h1>
          <p className="mt-5 max-w-md mx-auto text-xl text-gray-500">
            Your Community. Your Choice. Your Connections.
          </p>
        </div>

        {/* <div className="mt-12 lg:mt-16">
          <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="http://googleusercontent.com/image_generation_content/3"
              alt="A diverse group of happy adults enjoying an activity together"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        </div> */}

        <div className="mt-12 lg:mt-16 text-lg text-gray-700 space-y-6 leading-relaxed">
          <p>
            <strong>{
              <Link
                href="/signin"
                className=" py-2 text-md font-bold text-indigo-700  hover:text-indigo-500"
              >
                cf app
              </Link>
            }</strong> was born from a simple idea: to create a dedicated, vibrant, and supportive space for individuals who have chosen to live a life without children. We recognized that while the childfree community is vast and diverse, finding meaningful connections based on shared life choices can sometimes be a challenge.
          </p>
          <p>
            Our mission is to bridge that gap. We are more than just a social app; we are a platform for building genuine friendships, discovering new hobbies, and engaging in conversations that matter to you, free from societal judgment or expectation. Whether you're looking for a travel partner, a book club, local events, or simply a place to share your thoughts with like-minded people, you've found your home.
          </p>
          <p>
            Here, your choice is celebrated. Your lifestyle is understood. Your connections are waiting.
          </p>
          <p className="text-center font-semibold text-indigo-600 pt-4">
            {"Join us and start building the community you've been looking for."}
          </p>
        </div>
      </div>
    </div>
  );
}
