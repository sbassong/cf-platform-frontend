import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, MessageSquare, CalendarDays } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Connect on Your Own Terms
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform is built with the features you need to foster genuine
              connections and build a supportive community.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-12">
          <Card data-cy="feature-card-communities">
            <CardHeader>
              <Users className="h-8 w-8 mb-4 text-primary" />
              <CardTitle>Groups & Communities</CardTitle>
              <CardDescription>
                Find or create private and public groups based on shared interests,
                hobbies, or location. Your space, your rules.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card data-cy="feature-card-messaging">
            <CardHeader>
              <MessageSquare className="h-8 w-8 mb-4 text-primary" />
              <CardTitle>Direct & Group Messaging</CardTitle>
              <CardDescription>
                Enjoy secure, real-time conversations with friends or groups
                without leaving the platform.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card data-cy="feature-card-events">
            <CardHeader>
              <CalendarDays className="h-8 w-8 mb-4 text-primary" />
              <CardTitle>Events & Meetups</CardTitle>
              <CardDescription>
                Organize and discover local or virtual events, from casual
                get-togethers to workshops and trips.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}