"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/icons/GoogleIcon";



export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/bridge" });
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      window.location.href = "/";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return(
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm" data-cy="signin-card">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Choose your preferred sign-in method
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Google Sign-In */}
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-600"

            onClick={handleGoogleLogin}
            data-cy="google-signin-button"
          >
            <GoogleIcon />
            Sign In with Google
          </Button>

          <Separator className="my-4" />

          {/* Credentials signin form  */}
          <form onSubmit={handleCredentialsLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-cy="signin-email"
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
                data-cy="signin-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500" data-cy="signin-error">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" data-cy="signin-submit">
              {isLoading ? "Signing In..." : "Sign In with email"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
