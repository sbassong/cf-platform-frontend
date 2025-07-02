"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // if (password.length < 8) {
    //   return setError("Password must be at least 8 characters long");
    // }

    if (password !== confirm) {
      return setError("Passwords must match.");
    }

    const signupData = {
      email,
      password,
      username,
      displayName,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupData),
        }
      );

      if (res.ok) {
        router.push("/signin");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to sign up.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm" data-cy="signup-card">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your_unique_username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-cy="signup-username"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Your Name"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                data-cy="signup-displayName"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-cy="signup-email"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-cy="signup-password"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm">Password</Label>
              <Input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                data-cy="signup-confirm"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500" data-cy="signup-error">
                {error}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col items-start gap-4 mt-6">
            <Button type="submit" className="w-full" data-cy="signup-submit">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <p className="text-sm text-center w-full">
              Already have an account?{" "}
              <Link href="/signin" className="underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
