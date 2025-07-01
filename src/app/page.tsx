import Hero from '@/app/components/landing/Hero';
import FeaturedContent from '@/app/components/landing/FeaturedContent';
import PlatformStats from '@/app/components/landing/PlatformStats';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <FeaturedContent />
      <PlatformStats />

      {/* Final CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ready to Find Your Community?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Create an account in minutes and start connecting with like-minded people today.
          </p>
          <Link
            href="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 sm:w-auto"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
}