import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 mx-auto">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            What Our Community Is Saying
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Real stories from people who have found their place here.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 mt-8">
          <Card data-cy="testimonial-card-1">
            <CardContent className="p-6">
              <blockquote className="text-lg italic">
                &quot;I&apos;ve finally found a space where my life choices are
                celebrated, not questioned. The connections I&apos;ve made are
                genuine and supportive.&quot;
              </blockquote>
            </CardContent>
            <CardHeader className="flex flex-row items-center justify-start gap-4 pt-0">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Maria K.</p>
                <p className="text-sm text-muted-foreground">Joined 2023</p>
              </div>
            </CardHeader>
          </Card>
          <Card data-cy="testimonial-card-2">
            <CardContent className="p-6">
              <blockquote className="text-lg italic">
                &quot;This platform is a breath of fresh air. It&apos;s more than just a
                social network; it&apos;s a true community where I feel understood.&quot;
              </blockquote>
            </CardContent>
            <CardHeader className="flex flex-row items-center justify-start gap-4 pt-0">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>DS</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">David S.</p>
                <p className="text-sm text-muted-foreground">Joined 2024</p>
              </div>
            </CardHeader>
          </Card>
          <Card data-cy="testimonial-card-3">
            <CardContent className="p-6">
              <blockquote className="text-lg italic">
                &quot;Organizing a local meetup through the events feature was so
                easy. I met some amazing people who I now consider close
                friends.&quot;
              </blockquote>
            </CardContent>
            <CardHeader className="flex flex-row items-center justify-start gap-4 pt-0">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>LJ</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Liam J.</p>
                <p className="text-sm text-muted-foreground">Joined 2023</p>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
