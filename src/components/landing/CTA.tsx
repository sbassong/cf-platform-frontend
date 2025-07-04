import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section
      id="cta"
      className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Ready to Find Your People?
            </h2>
            <p className="mx-auto max-w-[600px] opacity-90 md:text-xl">
              Join a community that understands and celebrates your lifestyle.
              Signing up is free and only takes a minute.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <Link href="/signup">
              {/* With background-primary: change variant to "secondary" for high contrast */}
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                data-cy="cta-signup-button"
              >
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
