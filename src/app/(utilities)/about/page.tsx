import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Target, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* 1. Our Mission */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          A Space to Be Yourself
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          We believe everyone deserves a community where they are celebrated for
          who they are. Our mission is to provide a supportive, engaging, and
          respectful online home for child-free adults.
        </p>
      </section>

      {/* 2. Our Story */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
        <Card className="p-6 md:p-8">
          <p className="text-lg text-foreground/90 leading-relaxed">
            The Child-Free Platform was born from a simple observation: in a
            world largely centered around family life, a dedicated space for
            adults who have chosen a different path was missing. We saw the need
            for a social network free from judgment, where conversations,
            friendships, and activities could flourish around shared experiences
            and interests, not parental status. We set out to build more than
            just a platform; we set out to build a community.
          </p>
        </Card>
      </section>

      {/* 3. Our Core Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Heart className="h-10 w-10 mx-auto text-primary mb-2" />
              <CardTitle>Respect</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We foster an environment of mutual respect for all life choices
                and backgrounds.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Users className="h-10 w-10 mx-auto text-primary mb-2" />
              <CardTitle>Authenticity</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We encourage genuine connection by providing a space where you
                can be your true self.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Target className="h-10 w-10 mx-auto text-primary mb-2" />
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We are a community built on a foundation of support,
                understanding, and shared experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. Meet the Founders */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Meet the Founders
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Founder 1 */}
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/lady-cat.jpg" alt="Co-founder 1" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">Jane Doe</h3>
            <p className="text-primary">Co-Founder & CEO</p>
            <p className="mt-2 text-muted-foreground text-sm">
              "My goal is for this platform to be a place of joy, connection,
              and empowerment."
            </p>
          </div>
          {/* Founder 2 */}
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/lady-cat.jpg" alt="Co-founder 2" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">John Smith</h3>
            <p className="text-primary">Co-Founder & CTO</p>
            <p className="mt-2 text-muted-foreground text-sm">
              "We're focused on building a secure, intuitive, and reliable
              platform for our community."
            </p>
          </div>
          {/* Founder 3 */}
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/lady-cat.jpg" alt="Co-founder 3" />
              <AvatarFallback>ES</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">Emily Stone</h3>
            <p className="text-primary">Co-Founder & CCO</p>
            <p className="mt-2 text-muted-foreground text-sm">
              "Every feature is designed to foster authentic connection and a
              supportive environment."
            </p>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="text-center bg-muted p-8 rounded-lg">
        <h2 className="text-3xl font-bold">Join the Conversation</h2>
        <p className="mt-2 text-muted-foreground">
          Ready to be a part of our growing community?
        </p>
        <Link href="/signup" className="mt-4 inline-block">
          <Button size="lg">Create Your Account</Button>
        </Link>
      </section>
    </div>
  );
}
