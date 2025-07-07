import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      id="hero"
      className="w-full bg-background pt-20 pb-12 md:pt-32 md:pb-20"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Column: Headline and CTA */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
              <span className="block">Find Your People,</span>
              <span className="block text-primary">Live Your Passion.</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-muted-foreground sm:text-xl md:mt-5 md:max-w-3xl">
              The vibrant social hub for child-free adults. See what&apos;s
              happening right now and join the conversation.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center md:justify-start">
              <Link href="/signup">
                <Button size="lg" data-cy="hero-signup-button">
                  Join the Conversation
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Image Block */}
          <div className="hidden md:block">
            <div className="relative w-full aspect-[4/3] rounded-xl shadow-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop"
                alt="A group of friends enjoying a social gathering"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
